import { computed, ref } from "vue"

export type Theme = "light" | "dark"
const STORAGE_KEY = "tsboard-theme"
const theme = ref<Theme>(document.documentElement.classList.contains("dark") ? "dark" : "light")

const apply = (value: Theme) => {
  theme.value = value
  document.documentElement.classList.toggle("dark", value === "dark")
  localStorage.setItem(STORAGE_KEY, value)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", value === "dark" ? "#1c1917" : "#f5f5f4")
}

export const useTheme = () => ({
  theme: computed(() => theme.value),
  isDark: computed(() => theme.value === "dark"),
  setTheme: apply,
  toggleTheme: () => apply(theme.value === "dark" ? "light" : "dark"),
})
