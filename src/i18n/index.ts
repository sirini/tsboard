import { createI18n } from "vue-i18n"

export const messages = {
  en: {
    app: {
      name: "TSBOARD",
      tagline: "Community, without the weight",
    },
    common: {
      cancel: "Cancel",
      close: "Close",
      loading: "Loading…",
      remove: "Remove",
      save: "Save",
      search: "Search",
    },
    navigation: {
      administration: "Administration",
      communities: "Communities",
      messages: "Messages",
      notifications: "Notifications",
      profile: "Profile",
      signIn: "Sign in",
      signOut: "Sign out",
    },
  },
} as const

export const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
})
