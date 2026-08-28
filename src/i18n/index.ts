import { createI18n } from "vue-i18n"
import { en } from "./en"
import { ko } from "./ko"
import { adminEn } from "./admin-en"
import { adminKo } from "./admin-ko"

export type Locale = "ko" | "en"
export const LOCALE_STORAGE_KEY = "tsboard-locale"
export const messages = {
  ko: { ...ko, admin: adminKo },
  en: { ...en, admin: adminEn },
} as const

const savedLocale =
  typeof window === "undefined" ? null : window.localStorage.getItem(LOCALE_STORAGE_KEY)
const initialLocale: Locale = savedLocale === "en" || savedLocale === "ko" ? savedLocale : "ko"

if (typeof document !== "undefined") document.documentElement.lang = initialLocale

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: "ko",
  messages,
})

export const setLocale = (locale: Locale) => {
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
  document.title = messages[locale].app.documentTitle
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}
