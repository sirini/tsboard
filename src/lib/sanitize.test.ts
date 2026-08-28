import { describe, expect, it } from "vitest"
import { sanitizeHtml } from "./sanitize"

describe("sanitizeHtml", () => {
  it("removes scripts and unsafe event handlers", () => {
    const result = sanitizeHtml('<p onclick="alert(1)">Safe</p><script>alert(1)</script>')
    expect(result).toBe("<p>Safe</p>")
  })

  it("hardens links opened in a new tab", () => {
    const result = sanitizeHtml('<a href="https://example.com">Example</a>')
    expect(result).toContain('target="_blank"')
    expect(result).toContain('rel="noopener noreferrer"')
  })
})
