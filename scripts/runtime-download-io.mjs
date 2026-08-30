import { randomBytes } from "node:crypto"
import { createWriteStream } from "node:fs"
import { lstat, mkdir, open, rename, rm } from "node:fs/promises"
import { join, resolve } from "node:path"
import { Readable, Transform } from "node:stream"
import { pipeline } from "node:stream/promises"
import { sha256File } from "./runtime-download-lib.mjs"

const MAX_ARCHIVE_BYTES = 64 * 1024 * 1024

const exists = async (path) => {
  try {
    return await lstat(path)
  } catch (error) {
    if (error.code === "ENOENT") return null
    throw error
  }
}

const assertRealDirectory = async (path) => {
  const info = await exists(path)
  if (!info) {
    await mkdir(path, { recursive: true, mode: 0o755 })
    return
  }
  if (!info.isDirectory() || info.isSymbolicLink()) {
    throw new Error(`runtime 대상이 일반 폴더가 아닙니다: ${path}`)
  }
}

export const downloadPinnedArchive = async (root, descriptor, fetchImpl = fetch) => {
  const cache = join(root, ".tsboard", "downloads")
  await assertRealDirectory(cache)
  const target = join(cache, descriptor.release.asset)
  const current = await exists(target)
  if (current) {
    if (!current.isFile() || current.isSymbolicLink()) {
      throw new Error("runtime cache가 일반 파일이 아닙니다")
    }
    if (
      current.size === descriptor.release.sizeBytes &&
      (await sha256File(target)) === descriptor.release.sha256
    ) {
      return target
    }
    await rm(target)
  }
  const response = await fetchImpl(descriptor.release.url, {
    redirect: "follow",
    signal: globalThis.AbortSignal.timeout(120_000),
  })
  if (!response.ok || !response.body) {
    throw new Error(`runtime 다운로드 실패: HTTP ${response.status}`)
  }
  const temporary = `${target}.part-${randomBytes(6).toString("hex")}`
  let received = 0
  const limit = new Transform({
    transform(chunk, _encoding, callback) {
      received += chunk.length
      callback(
        received <= MAX_ARCHIVE_BYTES
          ? null
          : new Error("runtime 다운로드가 크기 한계를 초과합니다"),
        chunk,
      )
    },
  })
  try {
    await pipeline(
      Readable.fromWeb(response.body),
      limit,
      createWriteStream(temporary, { flags: "wx", mode: 0o600 }),
    )
    if (
      received !== descriptor.release.sizeBytes ||
      (await sha256File(temporary)) !== descriptor.release.sha256
    ) {
      throw new Error("runtime archive 크기 또는 SHA-256이 고정 descriptor와 다릅니다")
    }
    await rename(temporary, target)
    return target
  } finally {
    await rm(temporary, { force: true })
  }
}

export const withRuntimeLock = async (root, task) => {
  const directory = join(resolve(root), ".tsboard")
  await assertRealDirectory(directory)
  const lockPath = join(directory, "runtime.lock")
  let lock
  try {
    lock = await open(lockPath, "wx", 0o600)
  } catch (error) {
    if (error.code === "EEXIST") throw new Error("다른 TSBOARD runtime 작업이 진행 중입니다")
    throw error
  }
  try {
    return await task()
  } finally {
    await lock.close()
    await rm(lockPath, { force: true })
  }
}
