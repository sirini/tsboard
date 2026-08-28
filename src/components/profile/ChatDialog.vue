<script setup lang="ts">
import { Send } from "lucide-vue-next"
import { nextTick, ref, watch } from "vue"
import { toast } from "vue-sonner"
import { chatApi } from "@/api/chat"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { relativeTime } from "@/lib/utils"
import type { ChatMessage } from "@/types/content"
import { useAuthStore } from "@/stores/auth"

const props = defineProps<{ userUid: number; userName: string }>()
const open = defineModel<boolean>({ required: true })
const auth = useAuthStore()
const messages = ref<ChatMessage[]>([])
const message = ref("")
const loading = ref(false)
const list = ref<HTMLElement | null>(null)
const load = async () => {
  loading.value = true
  try {
    const response = await chatApi.history(props.userUid)
    if (response.success) messages.value = response.result
    else toast.error(response.error)
    await nextTick()
    list.value?.scrollTo({ top: list.value.scrollHeight })
  } finally {
    loading.value = false
  }
}
const send = async () => {
  const value = message.value.trim()
  if (!value) return
  const response = await chatApi.send(props.userUid, value)
  if (!response.success) return toast.error(response.error)
  message.value = ""
  await load()
}
watch(open, (value) => {
  if (value) void load()
})
</script>
<template>
  <Dialog
    v-model="open"
    :title="`Message ${userName}`"
    description="Private messages stay between participants and site operators."
    ><div ref="list" class="max-h-96 space-y-3 overflow-y-auto rounded-lg bg-muted/35 p-3">
      <div v-if="loading" class="py-10 text-center"><Spinner label="Loading messages" /></div>
      <div
        v-for="item in messages"
        :key="item.uid"
        :class="['flex', item.userUid === auth.user.uid ? 'justify-end' : 'justify-start']"
      >
        <div
          :class="[
            'max-w-[80%] rounded-xl px-3 py-2 text-sm',
            item.userUid === auth.user.uid
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border',
          ]"
        >
          <p>{{ item.message }}</p>
          <p class="mt-1 text-[10px] opacity-65">{{ relativeTime(item.timestamp) }}</p>
        </div>
      </div>
      <p
        v-if="!loading && !messages.length"
        class="py-10 text-center text-sm text-muted-foreground"
      >
        No messages yet.
      </p>
    </div>
    <form class="mt-3 flex gap-2" @submit.prevent="send">
      <Input v-model="message" autocomplete="off" placeholder="Write a message" /><Button
        type="submit"
        size="icon"
        aria-label="Send"
        ><Send
      /></Button></form
  ></Dialog>
</template>
