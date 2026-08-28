import { afterEach, describe, expect, it } from "vitest"
import { LOCALE_STORAGE_KEY, messages, setLocale } from "./index"

const leafPaths = (value: unknown, prefix = ""): string[] => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [prefix]
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe("localization", () => {
  afterEach(() => {
    setLocale("ko")
  })

  it("keeps Korean and English message contracts in sync", () => {
    expect(leafPaths(messages.ko).sort()).toEqual(leafPaths(messages.en).sort())
  })

  it("switches the document language and remembers the preference", () => {
    setLocale("en")
    expect(document.documentElement.lang).toBe("en")
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en")
    expect(document.title).toContain("Community, without the weight")
  })
})
