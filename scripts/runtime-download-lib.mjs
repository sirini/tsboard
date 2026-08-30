import { createHash, randomBytes } from "node:crypto"
import { Buffer } from "node:buffer"
import { createReadStream } from "node:fs"
import {
  chmod,
  lstat,
  mkdir,
  mkdtemp,
  open,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises"
import { dirname, join, posix, relative, resolve, sep } from "node:path"
import { pipeline } from "node:stream/promises"
import { createGunzip } from "node:zlib"
import tar from "tar-stream"
import { validateDescriptor } from "./runtime-descriptor.mjs"

const MAX_RUNTIME_BYTES = 110 * 1024 * 1024
const MAX_RUNTIME_FILES = 100
const RECEIPT_PATH = ".tsboard/runtime.json"
const RUNTIME_PREFIXES = ["lib/", "licenses/sharp-libvips/"]
const REQUIRED_LICENSES = [
  "Apache-2.0.txt",
  "LGPL-3.txt",
  "README.md",
  "THIRD-PARTY-NOTICES.md",
  "compat-build.json",
  "package.json",
  "versions.json",
]

const exists = async (path) => {
  try {
    return await lstat(path)
  } catch (error) {
    if (error.code === "ENOENT") return null
    throw error
  }
}

export const sha256File = async (path) => {
  const hash = createHash("sha256")
  for await (const chunk of createReadStream(path)) hash.update(chunk)
  return hash.digest("hex")
}

const safeRelativePath = (value) =>
  value.length > 0 &&
  value === posix.normalize(value) &&
  !posix.isAbsolute(value) &&
  value !== ".." &&
  !value.startsWith("../") &&
  !value.includes("\\") &&
  !value.includes("\0")

const isRuntimeFile = (path, descriptor) =>
  path === descriptor.runtime.goapiPath ||
  RUNTIME_PREFIXES.some((prefix) => path.startsWith(prefix))

const selectedArchivePath = (name, descriptor) => {
  const root = descriptor.release.archiveRoot
  if (name === root || name === `${root}/`) return null
  if (!safeRelativePath(name) || !name.startsWith(`${root}/`)) {
    throw new Error(`안전하지 않은 runtime archive 경로입니다: ${name}`)
  }
  const path = name.slice(root.length + 1).replace(/\/$/, "")
  if (path === "manifest.json" || path === "checksums.txt" || isRuntimeFile(path, descriptor)) {
    return path
  }
  return null
}

const writeArchiveEntry = async (entry, target, header, state) => {
  if (header.type !== "file")
    throw new Error(`runtime에 링크나 특수 파일을 포함할 수 없습니다: ${header.name}`)
  if (state.seen.has(target)) throw new Error(`runtime archive 경로가 중복됩니다: ${target}`)
  state.seen.add(target)
  state.files += 1
  state.bytes += header.size
  if (state.files > MAX_RUNTIME_FILES || state.bytes > MAX_RUNTIME_BYTES || header.size < 0) {
    throw new Error("runtime archive가 파일 수 또는 압축 해제 크기 한계를 초과합니다")
  }
  const destination = join(state.staging, ...target.split("/"))
  await mkdir(dirname(destination), { recursive: true, mode: 0o755 })
  const file = await open(destination, "wx", target === state.goapiPath ? 0o755 : 0o644)
  let written = 0
  try {
    for await (const chunk of entry) {
      written += chunk.length
      if (written > header.size) throw new Error(`runtime 파일 크기가 올바르지 않습니다: ${target}`)
      await file.write(chunk)
    }
  } finally {
    await file.close()
  }
  if (written !== header.size)
    throw new Error(`runtime 파일을 완전히 추출하지 못했습니다: ${target}`)
}

export const extractRuntimeArchive = async (archivePath, staging, descriptor) => {
  const parser = tar.extract()
  const state = {
    staging,
    goapiPath: descriptor.runtime.goapiPath,
    seen: new Set(),
    files: 0,
    bytes: 0,
  }
  const reading = pipeline(createReadStream(archivePath), createGunzip(), parser)
  try {
    for await (const entry of parser) {
      const target = selectedArchivePath(entry.header.name, descriptor)
      if (target && entry.header.type !== "directory") {
        await writeArchiveEntry(entry, target, entry.header, state)
      } else {
        for await (const _chunk of entry) void _chunk
      }
    }
    await reading
  } catch (error) {
    parser.destroy(error)
    await reading.catch(() => undefined)
    throw error
  }
  return state
}

const parseChecksums = (content) => {
  const checksums = new Map()
  for (const line of content.trim().split(/\r?\n/)) {
    const match = /^([0-9a-f]{64}) {2}\.\/(.+)$/.exec(line)
    if (!match || !safeRelativePath(match[2]) || checksums.has(match[2])) {
      throw new Error("runtime 내부 checksums.txt 형식이 올바르지 않습니다")
    }
    checksums.set(match[2], match[1])
  }
  return checksums
}

const walkFiles = async (directory, base = directory) => {
  const info = await exists(directory)
  if (!info) return []
  if (!info.isDirectory() || info.isSymbolicLink())
    throw new Error(`runtime 경로가 일반 폴더가 아닙니다: ${directory}`)
  const results = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`runtime에 링크를 포함할 수 없습니다: ${path}`)
    if (entry.isDirectory()) results.push(...(await walkFiles(path, base)))
    else if (entry.isFile()) results.push(relative(base, path).split(sep).join("/"))
    else throw new Error(`runtime에 특수 파일을 포함할 수 없습니다: ${path}`)
  }
  return results
}

const validateManifest = (manifest, descriptor) => {
  const valid =
    manifest?.schemaVersion === 2 &&
    manifest.releaseVersion === descriptor.productVersion &&
    manifest.target?.os === descriptor.target.os &&
    manifest.target?.arch === descriptor.target.arch &&
    manifest.apiContract === descriptor.apiContract &&
    manifest.components?.goapi?.version === descriptor.runtime.goapiVersion &&
    manifest.components?.goapi?.commit === descriptor.runtime.goapiCommit &&
    manifest.entrypoints?.goapi === descriptor.runtime.goapiPath &&
    manifest.nativeLibraries?.libvips?.version === descriptor.runtime.libvipsVersion &&
    manifest.nativeLibraries?.libvips?.selection === descriptor.runtime.libvipsSelection
  if (!valid) throw new Error("NUBO runtime manifest가 TSBOARD 고정 계약과 일치하지 않습니다")
}

const validateELF = async (path) => {
  const file = await open(path, "r")
  const header = Buffer.alloc(20)
  try {
    const { bytesRead } = await file.read(header, 0, header.length, 0)
    const valid =
      bytesRead === header.length &&
      header.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])) &&
      header[4] === 2 &&
      header[5] === 1 &&
      header.readUInt16LE(18) === 62
    if (!valid) throw new Error("GOAPI가 Linux amd64 ELF 실행 파일이 아닙니다")
  } finally {
    await file.close()
  }
}

export const validateExtractedRuntime = async (staging, descriptor) => {
  const manifestPath = join(staging, "manifest.json")
  const checksums = parseChecksums(await readFile(join(staging, "checksums.txt"), "utf8"))
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"))
  validateManifest(manifest, descriptor)
  if ((await sha256File(manifestPath)) !== checksums.get("manifest.json")) {
    throw new Error("runtime manifest checksum이 일치하지 않습니다")
  }
  const runtimeFiles = [
    descriptor.runtime.goapiPath,
    ...(await walkFiles(join(staging, "lib"))).map((path) => `lib/${path}`),
    ...(await walkFiles(join(staging, "licenses", "sharp-libvips"))).map(
      (path) => `licenses/sharp-libvips/${path}`,
    ),
  ].sort()
  const required = [
    descriptor.runtime.goapiPath,
    `lib/libvips-cpp.so.${descriptor.runtime.libvipsVersion}`,
    `lib/glibc-hwcaps/x86-64-v2/libvips-cpp.so.${descriptor.runtime.libvipsVersion}`,
    ...REQUIRED_LICENSES.map((name) => `licenses/sharp-libvips/${name}`),
  ].sort()
  if (JSON.stringify(runtimeFiles) !== JSON.stringify(required)) {
    throw new Error("runtime 파일 구성이 TSBOARD 고정 계약과 일치하지 않습니다")
  }
  const files = []
  for (const path of runtimeFiles) {
    const checksum = await sha256File(join(staging, ...path.split("/")))
    if (checksum !== checksums.get(path))
      throw new Error(`runtime 파일 checksum이 일치하지 않습니다: ${path}`)
    files.push({ path, sha256: checksum })
  }
  await validateELF(join(staging, ...descriptor.runtime.goapiPath.split("/")))
  return { manifest, files }
}

const parseReceipt = async (root) => {
  const path = join(root, RECEIPT_PATH)
  const info = await exists(path)
  if (!info) return null
  if (!info.isFile() || info.isSymbolicLink() || info.size > 64 * 1024) {
    throw new Error("TSBOARD runtime 영수증이 올바른 일반 파일이 아닙니다")
  }
  return JSON.parse(await readFile(path, "utf8"))
}

const managedPaths = (receipt) => {
  if (receipt?.schemaVersion !== 1 || !Array.isArray(receipt.files) || receipt.files.length < 1) {
    throw new Error("TSBOARD runtime 영수증이 손상되었습니다")
  }
  const seen = new Set()
  for (const file of receipt.files) {
    if (
      !isRuntimeFile(file.path, { runtime: { goapiPath: "bin/goapi" } }) ||
      seen.has(file.path) ||
      !/^[0-9a-f]{64}$/.test(file.sha256)
    ) {
      throw new Error("TSBOARD runtime 영수증의 파일 정보가 올바르지 않습니다")
    }
    seen.add(file.path)
  }
  return seen
}

export const inspectInstalledRuntime = async (root, descriptor) => {
  const receipt = await parseReceipt(root)
  const targets = [
    join(root, "bin", "goapi"),
    join(root, "lib"),
    join(root, "licenses", "sharp-libvips"),
  ]
  const present = (await Promise.all(targets.map(exists))).some(Boolean)
  if (!receipt && !present) return { state: "empty" }
  if (!receipt) throw new Error("기존 runtime에 관리 영수증이 없어 자동 교체할 수 없습니다")
  const expected = managedPaths(receipt)
  const actual = new Set()
  if (await exists(targets[0])) actual.add("bin/goapi")
  for (const path of await walkFiles(targets[1])) actual.add(`lib/${path}`)
  for (const path of await walkFiles(targets[2])) actual.add(`licenses/sharp-libvips/${path}`)
  if (actual.size !== expected.size || [...actual].some((path) => !expected.has(path))) {
    throw new Error("설치된 runtime에 영수증과 다른 파일이 있습니다")
  }
  for (const file of receipt.files) {
    const path = join(root, ...file.path.split("/"))
    const info = await exists(path)
    if (!info?.isFile() || info.isSymbolicLink() || (await sha256File(path)) !== file.sha256) {
      throw new Error(`설치된 runtime 파일이 변경되었거나 누락되었습니다: ${file.path}`)
    }
  }
  const current =
    receipt.productVersion === descriptor.productVersion &&
    receipt.apiContract === descriptor.apiContract &&
    receipt.release?.sha256 === descriptor.release.sha256 &&
    receipt.runtime?.goapiCommit === descriptor.runtime.goapiCommit
  return { state: current ? "current" : "managed", receipt }
}

const assertRealDirectory = async (path) => {
  const info = await exists(path)
  if (!info) {
    await mkdir(path, { recursive: true, mode: 0o755 })
    return
  }
  if (!info.isDirectory() || info.isSymbolicLink())
    throw new Error(`runtime 대상이 일반 폴더가 아닙니다: ${path}`)
}

const receiptFor = (descriptor, files) => ({
  schemaVersion: 1,
  productVersion: descriptor.productVersion,
  apiContract: descriptor.apiContract,
  release: {
    tag: descriptor.release.tag,
    asset: descriptor.release.asset,
    sha256: descriptor.release.sha256,
  },
  runtime: {
    goapiVersion: descriptor.runtime.goapiVersion,
    goapiCommit: descriptor.runtime.goapiCommit,
    libvipsVersion: descriptor.runtime.libvipsVersion,
  },
  files,
})

const commitRuntime = async (root, staging) => {
  for (const path of [join(root, "bin"), join(root, "licenses"), join(root, ".tsboard")]) {
    await assertRealDirectory(path)
  }
  const suffix = randomBytes(6).toString("hex")
  const pairs = [
    [join(staging, "bin", "goapi"), join(root, "bin", "goapi")],
    [join(staging, "lib"), join(root, "lib")],
    [join(staging, "licenses", "sharp-libvips"), join(root, "licenses", "sharp-libvips")],
    [join(staging, "runtime.json"), join(root, RECEIPT_PATH)],
  ]
  const moved = []
  try {
    for (const [source, target] of pairs) {
      const backup = `${target}.runtime-backup-${suffix}`
      if (await exists(target)) await rename(target, backup)
      try {
        await rename(source, target)
        moved.push({ target, backup, hadBackup: Boolean(await exists(backup)) })
      } catch (error) {
        if (await exists(backup)) await rename(backup, target)
        throw error
      }
    }
  } catch (error) {
    for (const item of moved.reverse()) {
      await rm(item.target, { recursive: true, force: true })
      if (item.hadBackup) await rename(item.backup, item.target)
    }
    throw error
  }
  for (const item of moved)
    if (item.hadBackup) await rm(item.backup, { recursive: true, force: true })
}

export const installRuntime = async ({ root, descriptor, getArchive, dryRun = false }) => {
  descriptor = validateDescriptor(descriptor)
  root = resolve(root)
  const before = await inspectInstalledRuntime(root, descriptor)
  if (before.state === "current")
    return { status: "current", changed: false, files: before.receipt.files }
  const beforeFingerprint = JSON.stringify(before)
  const stagingParent = join(root, ".tsboard", "staging")
  await assertRealDirectory(join(root, ".tsboard"))
  await assertRealDirectory(stagingParent)
  const staging = await mkdtemp(join(stagingParent, "runtime-"))
  try {
    const archivePath = await getArchive()
    await extractRuntimeArchive(archivePath, staging, descriptor)
    const validated = await validateExtractedRuntime(staging, descriptor)
    if (dryRun) return { status: "validated", changed: false, files: validated.files }
    const after = await inspectInstalledRuntime(root, descriptor)
    if (JSON.stringify(after) !== beforeFingerprint) {
      throw new Error("검증 중 설치된 runtime 상태가 바뀌었습니다")
    }
    await writeFile(
      join(staging, "runtime.json"),
      `${JSON.stringify(receiptFor(descriptor, validated.files), null, 2)}\n`,
      { mode: 0o644 },
    )
    await chmod(join(staging, "bin", "goapi"), 0o755)
    await commitRuntime(root, staging)
    return { status: "installed", changed: true, files: validated.files }
  } finally {
    await rm(staging, { recursive: true, force: true })
  }
}
