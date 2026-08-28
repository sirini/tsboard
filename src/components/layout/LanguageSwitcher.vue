<script setup lang="ts">
import { Check, Languages } from "lucide-vue-next"
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { setLocale, type Locale } from "@/i18n"

const { locale, t } = useI18n()
const menu = ref<HTMLDetailsElement | null>(null)

const changeLocale = (value: Locale) => {
  setLocale(value)
  menu.value?.removeAttribute("open")
}
</script>

<template>
  <details ref="menu" class="group relative">
    <summary
      class="flex h-9 list-none items-center gap-1.5 rounded-md px-2 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
      :aria-label="t('common.language')"
    >
      <Languages class="size-4" />
      <span class="hidden sm:inline">{{ locale === "ko" ? "한국어" : "EN" }}</span>
    </summary>
    <div class="absolute right-0 z-50 mt-2 w-36 rounded-lg border bg-popover p-1 text-sm shadow-lg">
      <button
        class="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-accent"
        @click="changeLocale('ko')"
      >
        한국어 <Check v-if="locale === 'ko'" class="size-4 text-primary" />
      </button>
      <button
        class="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-accent"
        @click="changeLocale('en')"
      >
        English <Check v-if="locale === 'en'" class="size-4 text-primary" />
      </button>
    </div>
  </details>
</template>
