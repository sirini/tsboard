<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { toast } from "vue-sonner"
import { commentApi } from "@/api/comment"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import EmptyState from "@/components/common/EmptyState.vue"
import { Spinner } from "@/components/ui/spinner"
import { Dialog } from "@/components/ui/dialog"
import CommentNode from "./CommentNode.vue"
import type { CommentItem } from "@/types/content"
import { buildCommentTree } from "@/lib/comments"
import { useAuthStore } from "@/stores/auth"

const props = defineProps<{ boardUid: number; postUid: number; isAdmin?: boolean }>()
const auth = useAuthStore()
const comments = ref<CommentItem[]>([])
const total = ref(0)
const loading = ref(true)
const writing = ref(false)
const content = ref("")
const removeOpen = ref(false)
const removeTargetUid = ref(0)

const tree = computed(() => buildCommentTree(comments.value))

const load = async () => {
  if (!props.boardUid || !props.postUid) return
  loading.value = true
  try {
    const response = await commentApi.list(props.boardUid, props.postUid, auth.user.uid)
    if (!response.success) return toast.error(response.error)
    comments.value = response.result.comments
    total.value = response.result.totalCommentCount
  } catch (error) {
    toast.error(`Comments could not be loaded: ${String(error)}`)
  } finally {
    loading.value = false
  }
}

const base = (text: string) => ({
  boardUid: props.boardUid,
  postUid: props.postUid,
  content: text,
  userUid: auth.user.uid,
})

const write = async () => {
  const text = content.value.trim()
  if (!text) return
  writing.value = true
  try {
    const response = await commentApi.write(base(text))
    if (!response.success) return toast.error(response.error)
    content.value = ""
    await load()
  } finally {
    writing.value = false
  }
}

const reply = async (replyTargetUid: number, text: string) => {
  const response = await commentApi.reply({ ...base(text), replyTargetUid })
  if (!response.success) toast.error(response.error)
  else await load()
}

const edit = async (modifyTargetUid: number, text: string) => {
  const response = await commentApi.modify({ ...base(text), modifyTargetUid })
  if (!response.success) toast.error(response.error)
  else await load()
}

const remove = async (removeTargetUid: number) => {
  const response = await commentApi.remove(props.boardUid, auth.user.uid, removeTargetUid)
  if (!response.success) toast.error(response.error)
  else {
    removeOpen.value = false
    await load()
  }
}

const askRemove = (uid: number) => {
  removeTargetUid.value = uid
  removeOpen.value = true
}

const vote = async (item: CommentItem) => {
  if (!auth.isLoggedIn) return toast.error("Sign in to vote.")
  const response = await commentApi.like(props.boardUid, item.uid, auth.user.uid, item.liked)
  if (!response.success) return toast.error(response.error)
  item.liked = !item.liked
  item.like += item.liked ? 1 : -1
}

onMounted(load)
watch(() => [props.boardUid, props.postUid], load)
</script>

<template>
  <section class="rounded-lg border bg-card p-4 sm:p-5">
    <h2 class="mb-4 text-lg font-semibold">{{ total }} comments</h2>
    <form v-if="auth.isLoggedIn" class="mb-5 space-y-2" @submit.prevent="write">
      <Textarea v-model="content" placeholder="Join the conversation" />
      <div class="flex justify-end">
        <Button type="submit" :disabled="writing || !content.trim()">{{
          writing ? "Posting…" : "Comment"
        }}</Button>
      </div>
    </form>
    <div v-else class="mb-5 rounded-lg bg-muted/55 p-4 text-center text-sm text-muted-foreground">
      <RouterLink
        :to="{ name: 'login', query: { redirect: $route.fullPath } }"
        class="font-medium text-primary hover:underline"
        >Sign in</RouterLink
      >
      to join the conversation.
    </div>
    <div v-if="loading" class="py-10 text-center"><Spinner label="Loading comments" /></div>
    <EmptyState
      v-else-if="!tree.length"
      title="No comments yet"
      message="Start the conversation."
    />
    <div v-else class="divide-y">
      <CommentNode
        v-for="item in tree"
        :key="item.uid"
        :item="item"
        :current-user-uid="auth.user.uid"
        :is-admin="isAdmin"
        @reply="reply"
        @edit="edit"
        @remove="askRemove"
        @vote="vote"
      />
    </div>
  </section>
  <Dialog
    v-model="removeOpen"
    title="Remove this comment?"
    description="The comment will no longer appear in this conversation."
    width="sm"
  >
    <template #footer>
      <Button variant="ghost" @click="removeOpen = false">Cancel</Button>
      <Button variant="destructive" @click="remove(removeTargetUid)">Remove comment</Button>
    </template>
  </Dialog>
</template>
