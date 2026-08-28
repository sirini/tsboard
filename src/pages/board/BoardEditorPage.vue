<script setup lang="ts">
import { File, Paperclip, Save, Trash2 } from "lucide-vue-next"
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue"
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router"
import { toast } from "vue-sonner"
import { editorApi, tradeApi, type EditorInput } from "@/api/editor"
import EmptyState from "@/components/common/EmptyState.vue"
import PageHeader from "@/components/common/PageHeader.vue"
import PageLoading from "@/components/common/PageLoading.vue"
import PostOptions from "@/components/editor/PostOptions.vue"
import EditorTags from "@/components/editor/EditorTags.vue"
import TiptapEditor from "@/components/editor/TiptapEditor.vue"
import TradeFields from "@/components/editor/TradeFields.vue"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BoardAttachment, BoardConfig, BoardDraft, TradeForm } from "@/types/board"
import { BOARD, STATUS } from "@/types/board"
import type { Pair } from "@/types/common"
import { formatBytes, stripTags } from "@/lib/utils"
import { TSBOARD } from "../../../tsboard.config"

const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id))
const postUid = computed(() => Number(route.params.postUid ?? 0))
const isEditing = computed(() => postUid.value > 0)
const config = ref<BoardConfig | null>(null)
const categories = ref<Pair[]>([])
const isAdmin = ref(false)
const loading = ref(true)
const error = ref("")
const submitting = ref(false)
const uploading = ref(false)
const title = ref("")
const content = ref("")
const categoryUid = ref(0)
const secret = ref(false)
const notice = ref(false)
const tags = ref<string[]>([])
const files = ref<File[]>([])
const existingFiles = ref<BoardAttachment[]>([])
const titleSuggestions = ref<string[]>([])
const draftOpen = ref(false)
const attachmentRemoveOpen = ref(false)
const attachmentRemoveUid = ref(0)
const trade = reactive<TradeForm>({
  brand: "",
  price: 0,
  priceType: 0,
  currency: "USD",
  productCondition: 2,
  location: "",
  shippingType: 0,
})
let draftTimer: ReturnType<typeof setTimeout> | undefined
let suggestionTimer: ReturnType<typeof setTimeout> | undefined

const draftKey = computed(() => `tsboard-draft-${id.value}`)
const meaningful = computed(
  () => title.value.trim() || stripTags(content.value).trim() || tags.value.length,
)

const load = async () => {
  loading.value = true
  try {
    const response = await editorApi.config(id.value)
    if (!response.success) {
      error.value = response.error
      return
    }
    config.value = response.result.config
    categories.value = response.result.categories
    isAdmin.value = response.result.isAdmin
    if (isEditing.value) await loadExisting()
    else if (localStorage.getItem(draftKey.value)) draftOpen.value = true
  } catch (reason) {
    error.value = String(reason)
  } finally {
    loading.value = false
  }
}

const applyExisting = (
  post: Awaited<ReturnType<typeof editorApi.loadPost>> extends { result: infer T } ? T : never,
) => {
  if (!post || !("post" in post)) return
  title.value = post.post.title
  content.value = post.post.content
  categoryUid.value = post.post.category.uid
  secret.value = post.post.status === STATUS.SECRET
  notice.value = post.post.status === STATUS.NOTICE
  tags.value = post.tags.map((tag) => tag.name)
  existingFiles.value = post.files
}

const loadExisting = async () => {
  if (!config.value) return
  if (config.value.type === BOARD.TRADE) {
    const response = await tradeApi.load(config.value.uid, postUid.value)
    if (!response.success) return void (error.value = response.error)
    applyExisting(response.result.board)
    Object.assign(trade, response.result.trade)
    return
  }
  const response = await editorApi.loadPost(config.value.uid, postUid.value)
  if (!response.success) return void (error.value = response.error)
  applyExisting(response.result)
}

const uploadInlineImages = async (targets: File[]) => {
  if (!config.value || uploading.value) return []
  if (targets.reduce((sum, file) => sum + file.size, 0) > TSBOARD.uploadLimit) {
    toast.error("Those images exceed the upload limit.")
    return []
  }
  uploading.value = true
  try {
    const response = await editorApi.uploadImages(config.value.uid, targets)
    if (!response.success) {
      toast.error(response.error)
      return []
    }
    return response.result
  } finally {
    uploading.value = false
  }
}

const chooseFiles = (event: Event) => {
  const selected = Array.from((event.target as HTMLInputElement).files ?? [])
  const size = selected.reduce((sum, file) => sum + file.size, 0)
  if (size > TSBOARD.uploadLimit) toast.error("Attachments exceed the upload limit.")
  else files.value = [...files.value, ...selected]
  ;(event.target as HTMLInputElement).value = ""
}

const removeExisting = async (fileUid: number) => {
  if (!config.value) return
  const response = await editorApi.removeAttachment(config.value.uid, postUid.value, fileUid)
  if (!response.success) return toast.error(response.error)
  existingFiles.value = existingFiles.value.filter((file) => file.uid !== fileUid)
  attachmentRemoveOpen.value = false
}

const askRemoveExisting = (fileUid: number) => {
  attachmentRemoveUid.value = fileUid
  attachmentRemoveOpen.value = true
}

const searchTitles = () => {
  clearTimeout(suggestionTimer)
  if (title.value.trim().length < 2) return void (titleSuggestions.value = [])
  suggestionTimer = setTimeout(async () => {
    const response = await editorApi.titles(title.value)
    if (response.success) titleSuggestions.value = response.result
  }, 250)
}

const selectTitleSuggestion = (suggestion: string) => {
  title.value = suggestion
  titleSuggestions.value = []
}

const input = (): EditorInput => ({
  boardUid: config.value?.uid ?? 0,
  categoryUid: categoryUid.value,
  title: title.value.trim(),
  content: content.value.trim(),
  files: files.value,
  isNotice: notice.value,
  isSecret: secret.value,
  tags: tags.value,
})

const submit = async () => {
  if (
    !config.value ||
    title.value.trim().length < 2 ||
    stripTags(content.value).trim().length < 2
  ) {
    toast.error("Add a title and some content before publishing.")
    return
  }
  submitting.value = true
  try {
    const base = input()
    const response =
      config.value.type === BOARD.TRADE
        ? isEditing.value
          ? await tradeApi.modify({ ...base, ...trade, postUid: postUid.value })
          : await tradeApi.write({ ...base, ...trade })
        : isEditing.value
          ? await editorApi.modify({ ...base, postUid: postUid.value })
          : await editorApi.write(base)
    if (!response.success) return toast.error(response.error)
    const created =
      typeof response.result === "number"
        ? response.result
        : (response.result as { postUid?: number } | null)?.postUid
    localStorage.removeItem(draftKey.value)
    toast.success(isEditing.value ? "Post updated." : "Post published.")
    await router.push(`/board/${id.value}/${isEditing.value ? postUid.value : created}`)
  } finally {
    submitting.value = false
  }
}

const persistDraft = () => {
  if (isEditing.value || !meaningful.value) return
  const draft: BoardDraft = {
    boardId: id.value,
    title: title.value,
    content: content.value,
    tags: tags.value,
    isSecret: secret.value,
    isNotice: notice.value,
    categoryUid: categoryUid.value,
    trade: config.value?.type === BOARD.TRADE ? { ...trade } : undefined,
    updatedAt: Date.now(),
  }
  localStorage.setItem(draftKey.value, JSON.stringify(draft))
}

const restoreDraft = () => {
  const raw = localStorage.getItem(draftKey.value)
  if (!raw) return void (draftOpen.value = false)
  try {
    const draft = JSON.parse(raw) as BoardDraft
    title.value = draft.title
    content.value = draft.content
    tags.value = draft.tags
    secret.value = draft.isSecret
    notice.value = draft.isNotice
    categoryUid.value = draft.categoryUid
    if (draft.trade) Object.assign(trade, draft.trade)
  } finally {
    draftOpen.value = false
  }
}

const discardDraft = () => {
  localStorage.removeItem(draftKey.value)
  draftOpen.value = false
}

watch(title, searchTitles)
watch(
  [title, content, tags, secret, notice, categoryUid, trade],
  () => {
    clearTimeout(draftTimer)
    draftTimer = setTimeout(persistDraft, 800)
  },
  { deep: true },
)
onMounted(load)
onBeforeRouteLeave(() => persistDraft())
onBeforeUnmount(() => {
  clearTimeout(draftTimer)
  clearTimeout(suggestionTimer)
})
</script>

<template>
  <PageLoading v-if="loading" />
  <EmptyState v-else-if="error || !config" title="Editor unavailable" :message="error"
    ><Button variant="outline" as-child
      ><RouterLink :to="`/board/${id}`">Back to community</RouterLink></Button
    ></EmptyState
  >
  <div v-else>
    <PageHeader
      eyebrow="Create"
      :title="isEditing ? `Edit post in ${config.name}` : `Post to ${config.name}`"
      :description="`t/${config.id} · ${config.info}`"
    />
    <Card
      ><CardContent class="space-y-5 p-4 sm:p-6"
        ><div class="space-y-2">
          <Label for="post-title">Title</Label
          ><Input
            id="post-title"
            v-model="title"
            maxlength="200"
            placeholder="An interesting title"
          />
          <div v-if="titleSuggestions.length" class="rounded-md border bg-popover p-1 text-sm">
            <button
              v-for="suggestion in titleSuggestions"
              :key="suggestion"
              class="block w-full truncate rounded px-3 py-2 text-left hover:bg-accent"
              @click="selectTitleSuggestion(suggestion)"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
        <div class="space-y-2">
          <Label>Body</Label><TiptapEditor v-model="content" :upload-images="uploadInlineImages" />
          <p v-if="uploading" class="text-xs text-muted-foreground">Uploading images…</p>
        </div>
        <TradeFields v-if="config.type === BOARD.TRADE" v-model="trade" /><PostOptions
          v-model:category="categoryUid"
          v-model:secret="secret"
          v-model:notice="notice"
          :categories="categories"
          :is-admin="isAdmin"
        />
        <EditorTags v-model="tags" />
        <div class="space-y-2">
          <Label>Attachments</Label
          ><label
            class="flex min-h-24 items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/25 text-sm text-muted-foreground hover:bg-muted/50"
            ><Paperclip class="size-4" />Choose files<input
              type="file"
              multiple
              class="sr-only"
              @change="chooseFiles"
          /></label>
          <div class="divide-y rounded-lg border">
            <div
              v-for="(file, index) in files"
              :key="`${file.name}-${index}`"
              class="flex items-center gap-2 p-3 text-sm"
            >
              <File class="size-4" /><span class="min-w-0 flex-1 truncate">{{ file.name }}</span
              ><span class="text-xs text-muted-foreground">{{ formatBytes(file.size) }}</span
              ><Button type="button" variant="ghost" size="icon-sm" @click="files.splice(index, 1)"
                ><Trash2
              /></Button>
            </div>
            <div
              v-for="file in existingFiles"
              :key="file.uid"
              class="flex items-center gap-2 p-3 text-sm"
            >
              <File class="size-4" /><span class="min-w-0 flex-1 truncate">{{ file.name }}</span
              ><Badge variant="outline">Uploaded</Badge
              ><Button
                type="button"
                variant="ghost"
                size="icon-sm"
                @click="askRemoveExisting(file.uid)"
                ><Trash2
              /></Button>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 border-t pt-5">
          <Button variant="ghost" as-child
            ><RouterLink :to="isEditing ? `/board/${id}/${postUid}` : `/board/${id}`"
              >Cancel</RouterLink
            ></Button
          ><Button :disabled="submitting" @click="submit"
            ><Save />{{ submitting ? "Saving…" : isEditing ? "Save changes" : "Publish" }}</Button
          >
        </div></CardContent
      ></Card
    >
  </div>
  <Dialog
    v-model="draftOpen"
    title="Restore your draft?"
    description="TSBOARD saved an unfinished post in this browser."
    width="sm"
    ><p class="text-sm text-muted-foreground">
      Continue where you left off, or discard the local draft and start fresh.
    </p>
    <template #footer
      ><Button variant="ghost" @click="discardDraft">Discard</Button
      ><Button @click="restoreDraft">Restore draft</Button></template
    ></Dialog
  >
  <Dialog
    v-model="attachmentRemoveOpen"
    title="Remove this attachment?"
    description="The uploaded file will be detached from this post immediately."
    width="sm"
  >
    <template #footer>
      <Button variant="ghost" @click="attachmentRemoveOpen = false">Cancel</Button>
      <Button variant="destructive" @click="removeExisting(attachmentRemoveUid)"
        >Remove attachment</Button
      >
    </template>
  </Dialog>
</template>
