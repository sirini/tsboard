import { readFile } from "node:fs/promises"

const base = (process.argv[2] ?? "http://127.0.0.1:3003/goapi").replace(/\/$/, "")
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"))
const expectedVersion = packageJson.version
const expectedContract = "1"

const request = async (path, expectedStatus = 200) => {
  const response = await fetch(`${base}${path}`)
  if (response.status !== expectedStatus) {
    throw new Error(`${path}: expected HTTP ${expectedStatus}, received ${response.status}`)
  }
  const type = response.headers.get("content-type") ?? ""
  return type.includes("application/json") ? response.json() : response.text()
}

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

const version = await request("/version")
assert(version.status === "ok" && version.service === "goapi", "/version is not GOAPI")
assert(
  version.version === expectedVersion,
  `GOAPI ${version.version} != TSBOARD ${expectedVersion}`,
)
assert(
  version.apiContract === expectedContract,
  `API contract ${version.apiContract} != ${expectedContract}`,
)

const product = await request("/home/nubo")
assert(product.success && product.result.version === expectedVersion, "/home/nubo version mismatch")

const menus = await request("/home/sidebar/links")
assert(menus.success && Array.isArray(menus.result), "sidebar response is invalid")
const firstBoard = menus.result.flatMap((group) => group.boards ?? [])[0]
if (firstBoard) {
  const list = await request(
    `/board/list?id=${encodeURIComponent(firstBoard.id)}&option=13&keyword=&page=1`,
  )
  assert(list.success && list.result.config.id === firstBoard.id, "board list response is invalid")
  assert(
    Array.isArray(list.result.posts) && Array.isArray(list.result.notices),
    "board posts are invalid",
  )
}

const signup = await request("/auth/signup/status")
assert(
  signup.success && ["verified_email", "invite_only", "disabled"].includes(signup.result.mode),
  "signup policy response is invalid",
)
await request("/auth/load", 401)

console.log(`GOAPI ${version.version} contract ${version.apiContract}: OK (${base})`)
