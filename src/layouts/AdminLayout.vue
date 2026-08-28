<script setup lang="ts">
import {
  ArrowLeft,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquareWarning,
  Moon,
  PanelsTopLeft,
  Sun,
  Users,
  X,
} from "lucide-vue-next"
import { ref } from "vue"
import { useRoute } from "vue-router"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/composables/useTheme"
import LanguageSwitcher from "@/components/layout/LanguageSwitcher.vue"

const route = useRoute()
const mobileOpen = ref(false)
const { isDark, toggleTheme } = useTheme()
const items = [
  { to: "/admin", label: "admin.overview", icon: LayoutDashboard },
  { to: "/admin/boards", label: "admin.communities", icon: PanelsTopLeft },
  { to: "/admin/users", label: "admin.users", icon: Users },
  { to: "/admin/moderation", label: "admin.moderation", icon: MessageSquareWarning },
  { to: "/admin/mail", label: "admin.mail", icon: Mail },
]
const active = (path: string) =>
  path === "/admin" ? route.path === path : route.path.startsWith(path)
</script>

<template>
  <div class="min-h-screen bg-muted/30">
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 border-r bg-sidebar p-4 transition-transform lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="mb-7 flex items-center justify-between">
        <RouterLink to="/admin" class="font-brand flex items-center gap-2 text-lg"
          >{{ $t("app.name") }} Admin</RouterLink
        ><Button variant="ghost" size="icon" class="lg:hidden" @click="mobileOpen = false"
          ><X
        /></Button>
      </div>
      <nav class="space-y-1">
        <RouterLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-accent',
            active(item.to) && 'bg-accent text-primary',
          ]"
          @click="mobileOpen = false"
          ><component :is="item.icon" class="size-4" />{{ $t(item.label) }}</RouterLink
        >
      </nav>
      <div class="absolute inset-x-4 bottom-4">
        <Button as-child variant="outline" class="w-full"
          ><RouterLink to="/"><ArrowLeft />{{ $t("admin.backToSite") }}</RouterLink></Button
        >
      </div>
    </aside>
    <div class="lg:pl-64">
      <header
        class="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur"
      >
        <Button variant="ghost" size="icon" class="lg:hidden" @click="mobileOpen = true"
          ><Menu
        /></Button>
        <p class="hidden text-sm text-muted-foreground sm:block">
          {{ $t("admin.operationsDashboard") }}
        </p>
        <div class="flex items-center gap-1">
          <Button variant="ghost" size="icon" @click="toggleTheme"
            ><Sun v-if="isDark" /><Moon v-else
          /></Button>
          <LanguageSwitcher />
        </div>
      </header>
      <main class="mx-auto max-w-7xl p-4 sm:p-6"><RouterView /></main>
    </div>
    <button
      v-if="mobileOpen"
      class="fixed inset-0 z-40 bg-black/40 lg:hidden"
      :aria-label="$t('admin.closeNavigation')"
      @click="mobileOpen = false"
    />
  </div>
</template>
