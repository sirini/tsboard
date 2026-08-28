<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import AppShell from "@/layouts/AppShell.vue"
import { Sonner } from "@/components/ui/sonner"

const route = useRoute()
const isAdmin = computed(() => route.meta.layout === "admin")
</script>

<template>
  <RouterView v-if="isAdmin" />
  <AppShell v-else><RouterView /></AppShell>
  <Sonner />
</template>
