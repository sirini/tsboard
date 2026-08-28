<script setup lang="ts">
import { onMounted } from "vue"
import AppFooter from "@/components/layout/AppFooter.vue"
import AppHeader from "@/components/layout/AppHeader.vue"
import BoardNavigation from "@/components/layout/BoardNavigation.vue"
import CommunityRail from "@/components/layout/CommunityRail.vue"
import { useHomeStore } from "@/stores/home"

const home = useHomeStore()
onMounted(async () => {
  await Promise.all([home.loadMenus(), home.visit(), home.loadNotifications()])
})
</script>

<template>
  <div class="min-h-screen">
    <AppHeader />
    <div
      class="mx-auto grid w-full max-w-[1480px] grid-cols-1 gap-4 px-3 py-4 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,760px)_280px]"
    >
      <aside class="sticky top-[4.5rem] hidden h-[calc(100vh-5.5rem)] overflow-y-auto lg:block">
        <BoardNavigation />
      </aside>
      <main class="min-w-0"><slot /></main>
      <aside class="sticky top-[4.5rem] hidden h-fit xl:block"><CommunityRail /></aside>
    </div>
    <AppFooter />
  </div>
</template>
