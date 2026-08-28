import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const recoverChars = (text = "") =>
  text.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">")

export const stripTags = (html = "") => html.replace(/<[^>]*>?/gm, "")
export const plainText = (html = "") => stripTags(recoverChars(html))

export const getIntlLocale = () =>
  typeof document !== "undefined" && document.documentElement.lang === "ko" ? "ko-KR" : "en-US"

export const formatDate = (timestamp: number, includeTime = false) => {
  if (!timestamp) return "—"
  const options: Intl.DateTimeFormatOptions = includeTime
    ? { dateStyle: "medium", timeStyle: "short" }
    : { dateStyle: "medium" }
  return new Intl.DateTimeFormat(getIntlLocale(), options).format(new Date(timestamp))
}

export const relativeTime = (timestamp: number) => {
  const seconds = Math.round((timestamp - Date.now()) / 1000)
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ]
  const formatter = new Intl.RelativeTimeFormat(getIntlLocale(), { numeric: "auto" })
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit)
  }
  return formatter.format(seconds, "second")
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat(getIntlLocale(), {
    notation: value > 999 ? "compact" : "standard",
  }).format(value)

export const formatBytes = (value: number) => {
  if (value < 1024) return `${value} B`
  const units = ["KB", "MB", "GB", "TB"]
  let amount = value / 1024
  let index = 0
  while (amount >= 1024 && index < units.length - 1) {
    amount /= 1024
    index += 1
  }
  return `${amount.toFixed(amount >= 10 ? 0 : 1)} ${units[index]}`
}

export const boardPath = (id: string, postUid?: number) =>
  postUid ? `/board/${id}/${postUid}` : `/board/${id}`
