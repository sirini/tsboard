<script setup lang="ts">
import { MessageCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-vue-next"
import { ref } from "vue"
import type { CommentTreeItem } from "@/lib/comments"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import VoteControl from "@/components/common/VoteControl.vue"
import HtmlContent from "@/components/common/HtmlContent.vue"
import { relativeTime } from "@/lib/utils"

defineOptions({ name: "CommentNode" })
const props = defineProps<{
  item: CommentTreeItem
  currentUserUid: number
  isAdmin?: boolean
  depth?: number
}>()
const emit = defineEmits<{
  reply: [targetUid: number, content: string]
  edit: [targetUid: number, content: string]
  remove: [targetUid: number]
  vote: [item: CommentTreeItem]
}>()
const mode = ref<"reply" | "edit" | null>(null)
const text = ref("")

const begin = (target: "reply" | "edit") => {
  mode.value = target
  text.value = target === "edit" ? props.item.content : ""
}
const submit = () => {
  const value = text.value.trim()
  if (!value || !mode.value) return
  if (mode.value === "reply") emit("reply", props.item.uid, value)
  else emit("edit", props.item.uid, value)
  mode.value = null
  text.value = ""
}
</script>

<template>
  <article :class="['relative', (depth ?? 0) > 0 && 'ml-3 border-l pl-3 sm:ml-6 sm:pl-5']">
    <div class="py-3">
      <div class="flex items-center gap-2 text-xs text-muted-foreground">
        <Avatar :src="item.writer.profile" :alt="item.writer.name" class="size-6" /><RouterLink
          :to="`/user/${item.writer.uid}`"
          class="font-medium text-foreground hover:underline"
          >{{ item.writer.name }}</RouterLink
        ><span>· {{ relativeTime(item.submitted) }}</span
        ><span v-if="item.modified">· {{ $t("comment.edited") }}</span>
      </div>
      <p v-if="item.status < 0" class="my-3 text-sm italic text-muted-foreground">
        [{{ $t("comment.removed") }}]
      </p>
      <HtmlContent v-else :html="item.content" class="my-2 text-sm" />
      <div v-if="item.status >= 0" class="flex flex-wrap items-center gap-1">
        <VoteControl
          :score="item.like"
          :liked="item.liked"
          :disabled="!currentUserUid"
          horizontal
          @toggle="emit('vote', item)"
        /><Button variant="ghost" size="sm" @click="begin('reply')"
          ><MessageCircle />{{ $t("comment.reply") }}</Button
        ><Button
          v-if="currentUserUid === item.writer.uid"
          variant="ghost"
          size="sm"
          @click="begin('edit')"
          ><Pencil />{{ $t("common.edit") }}</Button
        ><Button
          v-if="currentUserUid === item.writer.uid || isAdmin"
          variant="ghost"
          size="sm"
          class="text-destructive"
          @click="emit('remove', item.uid)"
          ><Trash2 />{{ $t("common.remove") }}</Button
        ><MoreHorizontal class="size-4 text-muted-foreground" />
      </div>
      <form v-if="mode" class="mt-3 space-y-2" @submit.prevent="submit">
        <Textarea
          v-model="text"
          :placeholder="
            mode === 'reply'
              ? $t('comment.replyTo', { name: item.writer.name })
              : $t('comment.editPlaceholder')
          "
        />
        <div class="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" @click="mode = null">{{
            $t("common.cancel")
          }}</Button
          ><Button type="submit" size="sm">{{
            mode === "reply" ? $t("comment.reply") : $t("common.save")
          }}</Button>
        </div>
      </form>
    </div>
    <CommentNode
      v-for="child in item.children"
      :key="child.uid"
      :item="child"
      :current-user-uid="currentUserUid"
      :is-admin="isAdmin"
      :depth="(depth ?? 0) + 1"
      @reply="(...args) => emit('reply', ...args)"
      @edit="(...args) => emit('edit', ...args)"
      @remove="(uid) => emit('remove', uid)"
      @vote="(comment) => emit('vote', comment)"
    />
  </article>
</template>
