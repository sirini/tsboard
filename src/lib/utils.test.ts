import { describe, expect, it, vi } from "vitest"
import {
  boardPath,
  formatBytes,
  formatNumber,
  plainText,
  recoverChars,
  relativeTime,
  stripTags,
} from "./utils"

describe("shared formatting utilities", () => {
  it("recovers escaped text and strips markup", () => {
    expect(recoverChars("A &amp; B &lt; C &gt; D")).toBe("A & B < C > D")
    expect(stripTags("<p>Hello <strong>world</strong></p>")).toBe("Hello world")
    expect(plainText("&lt;p&gt;Hello&lt;/p&gt;")).toBe("Hello")
  })

  it("formats byte and compact number values", () => {
    expect(formatBytes(512)).toBe("512 B")
    expect(formatBytes(1536)).toBe("1.5 KB")
    expect(formatNumber(1_200)).toMatch(/1[.,]2K/)
  })

  it("builds stable board paths", () => {
    expect(boardPath("free")).toBe("/board/free")
    expect(boardPath("free", 42)).toBe("/board/free/42")
  })

  it("uses human relative time", () => {
    vi.setSystemTime(new Date("2026-08-28T12:00:00Z"))
    expect(relativeTime(new Date("2026-08-28T11:00:00Z").getTime())).toBe("1 hour ago")
    vi.useRealTimers()
  })
})
