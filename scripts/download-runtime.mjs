import { readFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { installRuntime } from "./runtime-download-lib.mjs"
import { downloadPinnedArchive, withRuntimeLock } from "./runtime-download-io.mjs"
import { validateDescriptor } from "./runtime-descriptor.mjs"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")

const parseArguments = (args) => {
  const options = { root: projectRoot, archive: "", dryRun: false, json: false }
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === "--dry-run") options.dryRun = true
    else if (argument === "--json") options.json = true
    else if (argument === "--root" || argument === "--archive") {
      const value = args[index + 1]
      if (!value) throw new Error(`${argument} 값이 필요합니다`)
      options[argument.slice(2)] = resolve(value)
      index += 1
    } else if (argument === "--help") options.help = true
    else throw new Error(`알 수 없는 옵션입니다: ${argument}`)
  }
  return options
}

const help = `TSBOARD 공식 GOAPI runtime 다운로드

사용법
  npm run runtime:download
  npm run runtime:download -- --dry-run
  npm run runtime:download -- --json

고정된 NUBO release에서 GOAPI와 libvips를 검증해 bin/goapi, lib, licenses에 준비합니다.
DB migration, SPA build와 실행 중인 프로세스는 변경하지 않습니다.`

const main = async () => {
  const options = parseArguments(process.argv.slice(2))
  if (options.help) {
    console.log(help)
    return
  }
  if (process.platform !== "linux" || process.arch !== "x64") {
    throw new Error("공식 TSBOARD runtime은 Linux amd64에서만 설치할 수 있습니다")
  }
  const descriptor = validateDescriptor(
    JSON.parse(await readFile(joinDescriptor(options.root), "utf8")),
  )
  const result = await withRuntimeLock(options.root, () =>
    installRuntime({
      root: options.root,
      descriptor,
      dryRun: options.dryRun,
      getArchive: () =>
        options.archive
          ? Promise.resolve(options.archive)
          : downloadPinnedArchive(options.root, descriptor),
    }),
  )
  if (options.json) {
    console.log(JSON.stringify({ ...result, version: descriptor.productVersion }, null, 2))
    return
  }
  if (result.status === "current") console.log("✓ TSBOARD 공식 GOAPI runtime이 이미 최신입니다")
  else if (result.status === "validated")
    console.log("✓ TSBOARD 공식 GOAPI runtime 검증 완료 (변경 없음)")
  else console.log("✓ TSBOARD 공식 GOAPI runtime 설치 완료")
  console.log(
    `  GOAPI ${descriptor.runtime.goapiVersion} · libvips ${descriptor.runtime.libvipsVersion}`,
  )
  console.log("  bin/goapi · lib · licenses/sharp-libvips")
  console.log("  DB migration, SPA build와 프로세스 재시작은 수행하지 않았습니다")
}

const joinDescriptor = (root) => resolve(root, "runtime-sources.json")

main().catch((error) => {
  console.error(`오류: ${error.message}`)
  process.exitCode = 1
})
