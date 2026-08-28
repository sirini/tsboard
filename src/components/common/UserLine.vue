<script setup lang="ts">
import { Avatar } from "@/components/ui/avatar"
import { relativeTime } from "@/lib/utils"
defineProps<{
  uid: number
  name: string
  profile?: string
  timestamp?: number
  prefix?: string
  compact?: boolean
}>()
</script>
<template>
  <div class="flex min-w-0 items-center gap-2">
    <Avatar :src="profile" :alt="name" :class="compact ? 'size-6' : 'size-8'" />
    <p class="min-w-0 text-xs text-muted-foreground">
      <span v-if="prefix">{{ prefix }} </span
      ><RouterLink :to="`/user/${uid}`" class="font-medium text-foreground hover:underline">{{
        name
      }}</RouterLink
      ><span v-if="timestamp"> · {{ relativeTime(timestamp) }}</span>
    </p>
  </div>
</template>
