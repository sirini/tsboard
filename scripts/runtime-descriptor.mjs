import { posix } from "node:path"

const MAX_ARCHIVE_BYTES = 64 * 1024 * 1024

export const validateDescriptor = (descriptor) => {
  const validHash = /^[0-9a-f]{64}$/.test(descriptor?.release?.sha256 ?? "")
  const validCommit = /^[0-9a-f]{40}$/.test(descriptor?.runtime?.goapiCommit ?? "")
  const url = new URL(descriptor?.release?.url ?? "https://invalid.example")
  const valid =
    descriptor?.schemaVersion === 1 &&
    descriptor.productVersion === "1.3.0" &&
    descriptor.apiContract === "1" &&
    descriptor.target?.os === "linux" &&
    descriptor.target?.arch === "amd64" &&
    descriptor.release?.tag === `v${descriptor.productVersion}` &&
    descriptor.release?.asset === posix.basename(descriptor.release.asset) &&
    descriptor.release?.archiveRoot === descriptor.release.asset.replace(/\.tar\.gz$/, "") &&
    Number.isSafeInteger(descriptor.release?.sizeBytes) &&
    descriptor.release.sizeBytes > 0 &&
    descriptor.release.sizeBytes <= MAX_ARCHIVE_BYTES &&
    url.protocol === "https:" &&
    url.hostname === "github.com" &&
    validHash &&
    validCommit &&
    descriptor.runtime?.goapiVersion === descriptor.productVersion &&
    descriptor.runtime?.goapiPath === "bin/goapi" &&
    descriptor.runtime?.libvipsVersion === "8.18.3" &&
    descriptor.runtime?.libvipsSelection === "glibc-hwcaps"
  if (!valid) throw new Error("runtime-sources.json의 고정 runtime 정보가 올바르지 않습니다")
  return descriptor
}
