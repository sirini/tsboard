import { beforeEach, describe, expect, it, vi } from "vitest"
import { authApi } from "@/api/auth"
import { api, apiResourceUrl, ApiHttpError, setSessionExpiredHandler } from "./api"

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    statusText: status === 401 ? "Unauthorized" : "OK",
    headers: { "content-type": "application/json" },
  })

describe("API client", () => {
  beforeEach(() => {
    setSessionExpiredHandler(() => undefined)
  })

  it("refreshes an expired access session and retries once", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(json({ code: 2, error: "invalid token" }, 401))
      .mockResolvedValueOnce(json({ success: true, error: "" }))
      .mockResolvedValueOnce(json({ success: true, result: { uid: 7 } }))
    vi.stubGlobal("fetch", fetchMock)

    await expect(authApi.load()).resolves.toEqual({ success: true, result: { uid: 7 } })
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain("/goapi/auth/refresh")
  })

  it("expires the local session when refresh fails", async () => {
    const expired = vi.fn()
    setSessionExpiredHandler(expired)
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValueOnce(json({ code: 2 }, 401))
        .mockResolvedValueOnce(json({ success: false, error: "refresh expired" })),
    )

    await expect(api("/chat/list")).rejects.toBeInstanceOf(ApiHttpError)
    expect(expired).toHaveBeenCalledOnce()
  })

  it("does not refresh requests that explicitly disable retry", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(json({ code: 2 }, 401))
    vi.stubGlobal("fetch", fetchMock)

    await expect(api("/auth/load", { retry: false })).rejects.toMatchObject({ status: 401 })
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it("serializes JSON bodies and omits empty query values", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(json({ success: true }))
    vi.stubGlobal("fetch", fetchMock)

    await api("/example", {
      method: "POST",
      query: { page: 1, empty: "", absent: undefined },
      body: { title: "Hello" },
    })

    const [url, request] = fetchMock.mock.calls[0] ?? []
    expect(String(url)).toContain("/goapi/example?page=1")
    expect(String(url)).not.toContain("empty")
    expect(request?.body).toBe(JSON.stringify({ title: "Hello" }))
    expect(new Headers(request?.headers).get("content-type")).toBe("application/json")
  })

  it("resolves protected transfer paths below the configured API base", () => {
    expect(new URL(apiResourceUrl("/board/original/transfer?token=one")).pathname).toBe(
      "/goapi/board/original/transfer",
    )
  })
})
