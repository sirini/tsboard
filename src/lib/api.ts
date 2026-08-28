import { TSBOARD } from "../../tsboard.config"
import { CODE } from "@/types/common"

type Query = Record<string, unknown>
type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  query?: Query
  body?: BodyInit | Record<string, unknown> | null
  retry?: boolean
}

export class ApiHttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message)
  }
}

let refreshPromise: Promise<void> | null = null
let onSessionExpired: (() => void | Promise<void>) | null = null
let accessToken = ""

export const setAccessToken = (token = "") => {
  accessToken = token
}

export const setSessionExpiredHandler = (handler: () => void | Promise<void>) => {
  onSessionExpired = handler
}

const createUrl = (path: string, query?: Query) => {
  const url = new URL(`${TSBOARD.apiBase}${path}`, window.location.origin)
  if (!query) return url
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue
    url.searchParams.set(key, String(value))
  }
  return url
}

export const apiResourceUrl = (path: string) =>
  new URL(`${TSBOARD.apiBase}/${path.replace(/^\/+/, "")}`, window.location.origin).toString()

const createRequest = (options: ApiOptions): RequestInit => {
  const headers = new Headers({ Accept: "application/json" })
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`)
  let body = options.body as BodyInit | null | undefined
  if (
    body &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    typeof body !== "string"
  ) {
    headers.set("Content-Type", "application/json")
    body = JSON.stringify(body)
  }
  return {
    method: options.method ?? "GET",
    body,
    headers,
    credentials: "same-origin",
  }
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get("content-type") ?? ""
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text()
  if (!response.ok) throw new ApiHttpError(response.status, response.statusText, data)
  return data as T
}

const refreshSession = async () => {
  const response = await fetch(createUrl("/auth/refresh"), createRequest({ method: "POST" }))
  const data = await parseResponse<{ success: boolean; error: string; result?: unknown }>(response)
  if (!data.success || typeof data.result !== "string" || !data.result) {
    throw new ApiHttpError(401, data.error || "Session refresh failed", data)
  }
  setAccessToken(data.result)
}

const expireSession = async () => {
  setAccessToken()
  if (onSessionExpired) await onSessionExpired()
}

export const api = async <T>(path: string, options: ApiOptions = {}): Promise<T> => {
  const retry = options.retry ?? true
  try {
    const response = await fetch(createUrl(path, options.query), createRequest(options))
    return await parseResponse<T>(response)
  } catch (error) {
    if (!(error instanceof ApiHttpError) || error.status !== 401 || !retry) throw error
    const code = (error.data as { code?: number } | undefined)?.code
    if (path === "/auth/refresh" || code === CODE.EXPIRED) {
      await expireSession()
      throw error
    }
    if (!refreshPromise) {
      refreshPromise = refreshSession().finally(() => {
        refreshPromise = null
      })
    }
    try {
      await refreshPromise
      return await api<T>(path, { ...options, retry: false })
    } catch (refreshError) {
      await expireSession()
      throw refreshError
    }
  }
}
