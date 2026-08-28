<script setup lang="ts">
import { Bell, LogIn, Mail, Menu, Moon, Search, Settings, Sun, UserRound } from "lucide-vue-next"
import { ref, watch } from "vue"
import { useRouter } from "vue-router"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import BoardNavigation from "./BoardNavigation.vue"
import NotificationList from "./NotificationList.vue"
import LanguageSwitcher from "./LanguageSwitcher.vue"
import { SEARCH } from "@/types/common"
import { useAuthStore } from "@/stores/auth"
import { useHomeStore } from "@/stores/home"
import { useTheme } from "@/composables/useTheme"
import { Avatar } from "@/components/ui/avatar"

const router = useRouter()
const auth = useAuthStore()
const home = useHomeStore()
const { isDark, toggleTheme } = useTheme()
const keyword = ref("")
const mobileOpen = ref(false)
const notificationsOpen = ref(false)

const search = async () => {
  const value = keyword.value.trim()
  if (!value) return
  await router.push({ name: "search", params: { option: SEARCH.TITLE, keyword: value } })
  keyword.value = ""
}

const showNotifications = async () => {
  notificationsOpen.value = true
  await home.loadNotifications()
}

const signOut = async () => {
  await auth.logout()
  await router.push({ name: "home" })
}

watch(
  () => auth.isLoggedIn,
  (loggedIn) => {
    if (loggedIn) void home.loadNotifications()
  },
)
</script>

<template>
  <header class="sticky top-0 z-40 border-b bg-background/92 backdrop-blur-xl">
    <div
      class="mx-auto flex h-auto max-w-[1480px] flex-wrap items-center gap-2 px-3 py-2 sm:h-14 sm:flex-nowrap sm:py-0"
    >
      <Button
        variant="ghost"
        size="icon"
        class="lg:hidden"
        :aria-label="$t('header.openCommunities')"
        @click="mobileOpen = true"
        ><Menu
      /></Button>
      <RouterLink
        to="/"
        class="font-brand mr-1 flex shrink-0 items-center text-base tracking-tight sm:mr-2 sm:text-lg"
      >
        <span>{{ $t("app.name") }}</span>
      </RouterLink>

      <form
        class="order-last mx-auto flex w-full max-w-xl sm:order-none"
        role="search"
        @submit.prevent="search"
      >
        <div class="relative w-full">
          <Search
            class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          /><Input
            v-model="keyword"
            class="rounded-full bg-muted/65 pl-9"
            :aria-label="$t('header.searchAria')"
            :placeholder="$t('header.searchPlaceholder')"
          />
        </div>
      </form>

      <Button
        variant="ghost"
        size="icon"
        class="ml-auto sm:ml-0"
        :aria-label="isDark ? $t('header.lightTheme') : $t('header.darkTheme')"
        @click="toggleTheme"
        ><Sun v-if="isDark" /><Moon v-else
      /></Button>
      <LanguageSwitcher />
      <Button
        v-if="auth.isLoggedIn"
        variant="ghost"
        size="icon"
        class="relative"
        :aria-label="$t('navigation.notifications')"
        @click="showNotifications"
        ><Bell /><span
          v-if="home.unreadCount"
          class="absolute right-1 top-1 min-w-4 rounded-full bg-primary px-1 text-[10px] leading-4 text-primary-foreground"
          >{{ home.unreadCount }}</span
        ></Button
      >

      <details v-if="auth.isLoggedIn" class="group relative">
        <summary
          class="list-none rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar :src="auth.user.profile" :alt="auth.user.name" class="size-8" />
        </summary>
        <div class="absolute right-0 mt-2 w-52 rounded-lg border bg-popover p-1 text-sm shadow-lg">
          <div class="border-b px-3 py-2">
            <p class="truncate font-medium">{{ auth.user.name }}</p>
            <p class="truncate text-xs text-muted-foreground">{{ auth.user.id }}</p>
          </div>
          <RouterLink
            :to="`/user/${auth.user.uid}`"
            class="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
            ><UserRound class="size-4" />{{ $t("navigation.profile") }}</RouterLink
          >
          <RouterLink
            to="/messages"
            class="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
            ><Mail class="size-4" />{{ $t("navigation.messages") }}</RouterLink
          >
          <RouterLink
            v-if="auth.isAdmin"
            to="/admin"
            class="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
            ><Settings class="size-4" />{{ $t("navigation.administration") }}</RouterLink
          >
          <button
            class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-accent"
            @click="signOut"
          >
            <LogIn class="size-4 rotate-180" />{{ $t("navigation.signOut") }}
          </button>
        </div>
      </details>
      <Button v-else as-child size="sm"
        ><RouterLink :to="{ name: 'login' }"
          ><LogIn />{{ $t("navigation.signIn") }}</RouterLink
        ></Button
      >
    </div>
  </header>

  <Dialog
    v-model="mobileOpen"
    :title="$t('navigation.communities')"
    :description="$t('header.communitiesDescription')"
    width="sm"
    ><BoardNavigation @navigate="mobileOpen = false"
  /></Dialog>
  <Dialog
    v-model="notificationsOpen"
    :title="$t('navigation.notifications')"
    :description="$t('header.notificationsDescription')"
    width="md"
    ><NotificationList @close="notificationsOpen = false"
  /></Dialog>
</template>
