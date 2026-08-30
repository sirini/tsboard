import { Buffer } from "node:buffer"
import { createHash } from "node:crypto"
import { createWriteStream } from "node:fs"
import { mkdir, mkdtemp, readFile, stat, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pipeline } from "node:stream/promises"
import { createGzip } from "node:zlib"
import tar from "tar-stream"
import { describe, expect, it } from "vitest"
import { downloadPinnedArchive } from "./runtime-download-io.mjs"
import { installRuntime, sha256File } from "./runtime-download-lib.mjs"

const hash = (value) => createHash("sha256").update(value).digest("hex")

const runtimeFiles = (variant = "one") => {
  const goapi = Buffer.alloc(64)
  goapi.set([0x7f, 0x45, 0x4c, 0x46, 2, 1])
  goapi.writeUInt16LE(62, 18)
  const files = {
    "bin/goapi": goapi,
    "lib/libvips-cpp.so.8.18.3": Buffer.from(`base-${variant}`),
    "lib/glibc-hwcaps/x86-64-v2/libvips-cpp.so.8.18.3": Buffer.from(`v2-${variant}`),
  }
  for (const name of [
    "Apache-2.0.txt",
    "LGPL-3.txt",
    "README.md",
    "THIRD-PARTY-NOTICES.md",
    "compat-build.json",
    "package.json",
    "versions.json",
  ]) {
    files[`licenses/sharp-libvips/${name}`] = Buffer.from(`${name}-${variant}`)
  }
  return files
}

const baseDescriptor = () => ({
  schemaVersion: 1,
  productVersion: "1.3.0",
  apiContract: "1",
  target: { os: "linux", arch: "amd64" },
  release: {
    repository: "sirini/nubo",
    tag: "v1.3.0",
    url: "https://github.com/sirini/nubo/releases/download/v1.3.0/fixture.tar.gz",
    asset: "fixture.tar.gz",
    archiveRoot: "fixture",
    sizeBytes: 1,
    sha256: "0".repeat(64),
  },
  runtime: {
    goapiVersion: "1.3.0",
    goapiCommit: "9617087a573c603017f94cfdf288c120b4e59376",
    goapiPath: "bin/goapi",
    libvipsVersion: "8.18.3",
    libvipsSelection: "glibc-hwcaps",
  },
})

const addEntry = (pack, header, content = Buffer.alloc(0)) =>
  new Promise((resolve, reject) => {
    pack.entry({ ...header, size: content.length }, content, (error) =>
      error ? reject(error) : resolve(),
    )
  })

const createFixture = async (options = {}) => {
  const directory = await mkdtemp(join(tmpdir(), "tsboard-runtime-fixture-"))
  const archive = join(directory, "fixture.tar.gz")
  const descriptor = baseDescriptor()
  const files = runtimeFiles(options.variant)
  const manifest = Buffer.from(
    JSON.stringify({
      schemaVersion: 2,
      releaseVersion: options.releaseVersion ?? "1.3.0",
      target: { os: "linux", arch: "amd64" },
      apiContract: "1",
      nativeLibraries: { libvips: { version: "8.18.3", selection: "glibc-hwcaps" } },
      components: { goapi: { version: "1.3.0", commit: descriptor.runtime.goapiCommit } },
      entrypoints: { goapi: "bin/goapi" },
    }),
  )
  const checksums = new Map([
    ["manifest.json", hash(manifest)],
    ...Object.entries(files).map(([path, content]) => [path, hash(content)]),
  ])
  if (options.badChecksum) checksums.set("bin/goapi", "f".repeat(64))
  const checksumFile = Buffer.from(
    [...checksums].map(([path, checksum]) => `${checksum}  ./${path}`).join("\n") + "\n",
  )
  const pack = tar.pack()
  const writing = pipeline(pack, createGzip(), createWriteStream(archive))
  await addEntry(pack, { name: "fixture/manifest.json", type: "file" }, manifest)
  await addEntry(pack, { name: "fixture/checksums.txt", type: "file" }, checksumFile)
  for (const [path, content] of Object.entries(files)) {
    await addEntry(
      pack,
      { name: `fixture/${path}`, type: "file", mode: path === "bin/goapi" ? 0o755 : 0o644 },
      content,
    )
  }
  if (options.symlink) {
    await addEntry(pack, { name: "fixture/lib/escape", type: "symlink", linkname: "../../escape" })
  }
  pack.finalize()
  await writing
  descriptor.release.sizeBytes = (await stat(archive)).size
  descriptor.release.sha256 = await sha256File(archive)
  return { archive, descriptor, directory }
}

describe("TSBOARD pinned runtime", () => {
  it("installs the verified runtime in the NUBO-compatible layout and detects current", async () => {
    const root = await mkdtemp(join(tmpdir(), "tsboard-runtime-root-"))
    const fixture = await createFixture()
    const installed = await installRuntime({
      root,
      descriptor: fixture.descriptor,
      getArchive: async () => fixture.archive,
    })

    expect(installed.status).toBe("installed")
    expect((await stat(join(root, "bin/goapi"))).mode & 0o111).not.toBe(0)
    expect(await readFile(join(root, "lib/libvips-cpp.so.8.18.3"), "utf8")).toBe("base-one")
    const receipt = JSON.parse(await readFile(join(root, ".tsboard/runtime.json"), "utf8"))
    expect(receipt.runtime.goapiCommit).toBe(fixture.descriptor.runtime.goapiCommit)

    const current = await installRuntime({
      root,
      descriptor: fixture.descriptor,
      getArchive: async () => {
        throw new Error("current runtime must not read an archive")
      },
    })
    expect(current).toMatchObject({ status: "current", changed: false })
  })

  it("validates without installing during dry-run", async () => {
    const root = await mkdtemp(join(tmpdir(), "tsboard-runtime-dry-"))
    const fixture = await createFixture()
    const result = await installRuntime({
      root,
      descriptor: fixture.descriptor,
      getArchive: async () => fixture.archive,
      dryRun: true,
    })

    expect(result).toMatchObject({ status: "validated", changed: false })
    await expect(stat(join(root, "bin/goapi"))).rejects.toMatchObject({ code: "ENOENT" })
  })

  it("refuses modified managed files without overwriting them", async () => {
    const root = await mkdtemp(join(tmpdir(), "tsboard-runtime-modified-"))
    const fixture = await createFixture()
    await installRuntime({
      root,
      descriptor: fixture.descriptor,
      getArchive: async () => fixture.archive,
    })
    await writeFile(join(root, "bin/goapi"), "operator change")

    await expect(
      installRuntime({
        root,
        descriptor: fixture.descriptor,
        getArchive: async () => fixture.archive,
      }),
    ).rejects.toThrow("변경되었거나 누락")
    expect(await readFile(join(root, "bin/goapi"), "utf8")).toBe("operator change")
  })

  it("updates a managed runtime without touching the legacy runtime directory", async () => {
    const root = await mkdtemp(join(tmpdir(), "tsboard-runtime-update-"))
    const first = await createFixture()
    const second = await createFixture({ variant: "two" })
    await mkdir(join(root, "goapi-runtime"))
    await writeFile(join(root, "goapi-runtime/keep"), "legacy")
    await installRuntime({
      root,
      descriptor: first.descriptor,
      getArchive: async () => first.archive,
    })

    const updated = await installRuntime({
      root,
      descriptor: second.descriptor,
      getArchive: async () => second.archive,
    })

    expect(updated).toMatchObject({ status: "installed", changed: true })
    expect(await readFile(join(root, "lib/libvips-cpp.so.8.18.3"), "utf8")).toBe("base-two")
    expect(await readFile(join(root, "goapi-runtime/keep"), "utf8")).toBe("legacy")
  })
})

describe("TSBOARD runtime verification", () => {
  it("rejects links, manifest mismatches, and bad internal checksums", async () => {
    for (const [options, message] of [
      [{ symlink: true }, "링크나 특수 파일"],
      [{ releaseVersion: "1.3.1" }, "manifest"],
      [{ badChecksum: true }, "checksum"],
    ]) {
      const root = await mkdtemp(join(tmpdir(), "tsboard-runtime-invalid-"))
      const fixture = await createFixture(options)
      await expect(
        installRuntime({
          root,
          descriptor: fixture.descriptor,
          getArchive: async () => fixture.archive,
        }),
      ).rejects.toThrow(message)
    }
  })

  it("downloads once into the checksum cache and reuses it", async () => {
    const root = await mkdtemp(join(tmpdir(), "tsboard-runtime-cache-"))
    const fixture = await createFixture()
    const body = await readFile(fixture.archive)
    let requests = 0
    const fetchFixture = async () => {
      requests += 1
      return new globalThis.Response(body, { status: 200 })
    }
    const first = await downloadPinnedArchive(root, fixture.descriptor, fetchFixture)
    const second = await downloadPinnedArchive(root, fixture.descriptor, async () => {
      throw new Error("valid cache must not fetch")
    })

    expect(requests).toBe(1)
    expect(second).toBe(first)
    expect(await sha256File(first)).toBe(fixture.descriptor.release.sha256)
  })
})
