<script setup lang="ts">
import { ArrowLeft, ArrowRight, Download, File, List, Move, Pencil, Trash2 } from "lucide-vue-next"
import { computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { toast } from "vue-sonner"
import { boardApi } from "@/api/board"
import { tradeApi } from "@/api/editor"
import CommentSection from "@/components/comment/CommentSection.vue"
import EmptyState from "@/components/common/EmptyState.vue"
import HtmlContent from "@/components/common/HtmlContent.vue"
import PageLoading from "@/components/common/PageLoading.vue"
import UserLine from "@/components/common/UserLine.vue"
import VoteControl from "@/components/common/VoteControl.vue"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { SelectField } from "@/components/ui/select"
import type { BoardItem, BoardViewResult, TradeInfo, TradeViewResult } from "@/types/board"
import { STATUS } from "@/types/board"
import { apiResourceUrl } from "@/lib/api"
import { formatBytes, formatNumber, plainText, recoverChars } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"

const route = useRoute()
const router = useRouter()
const { locale, t, tm } = useI18n()
const auth = useAuthStore()
const view = ref<BoardViewResult | null>(null)
const trade = ref<TradeInfo | null>(null)
const loading = ref(true)
const error = ref("")
const deleteOpen = ref(false)
const moveOpen = ref(false)
const imageOpen = ref(false)
const originalImage = ref("")
const moveTargets = ref<BoardItem[]>([])
const targetBoardUid = ref(0)
const tradeStatusSaving = ref(false)
const id = computed(() => String(route.params.id))
const postUid = computed(() => Number(route.params.postUid))
const canManage = computed(() =>
  Boolean(view.value && (view.value.isAdmin || view.value.post.writer.uid === auth.user.uid)),
)
const conditionLabels = computed(() => tm("thread.conditions") as string[])
const statusLabels = computed(() => tm("thread.statuses") as string[])

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat(locale.value === "ko" ? "ko-KR" : "en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(price)

const markKey = computed(() => `tsboard-read-${id.value}-${postUid.value}`)
const load = async () => {
  loading.value = true
  error.value = ""
  try {
    const response = await boardApi.view({
      id: id.value,
      postUid: postUid.value,
      latestLimit: 5,
      needUpdateHit: !sessionStorage.getItem(markKey.value),
    })
    if (!response.success) {
      error.value = response.error
      return
    }
    view.value = response.result
    trade.value = "trade" in response.result ? (response.result as TradeViewResult).trade : null
    sessionStorage.setItem(markKey.value, "1")
  } catch (reason) {
    error.value = String(reason)
  } finally {
    loading.value = false
  }
}

const vote = async () => {
  if (!view.value) return
  if (!auth.isLoggedIn) {
    await router.push({ name: "login", query: { redirect: route.fullPath } })
    return
  }
  const response = await boardApi.like(
    view.value.config.uid,
    view.value.post.uid,
    view.value.post.liked,
  )
  if (!response.success) return toast.error(response.error)
  view.value.post.liked = !view.value.post.liked
  view.value.post.like += view.value.post.liked ? 1 : -1
}

const removePost = async () => {
  if (!view.value) return
  const response = await boardApi.remove(view.value.config.uid, view.value.post.uid)
  if (!response.success) return toast.error(response.error)
  toast.success(t("thread.removed"))
  await router.push(`/board/${id.value}`)
}

const prepareMove = async () => {
  if (!view.value) return
  const response = await boardApi.moveTargets(view.value.config.uid)
  if (!response.success) return toast.error(response.error)
  moveTargets.value = response.result
  targetBoardUid.value = response.result[0]?.uid ?? 0
  moveOpen.value = true
}

const movePost = async () => {
  if (!view.value || !targetBoardUid.value) return
  const target = moveTargets.value.find((board) => board.uid === targetBoardUid.value)
  const response = await boardApi.move(
    view.value.config.uid,
    targetBoardUid.value,
    view.value.post.uid,
  )
  if (!response.success) return toast.error(response.error)
  toast.success(t("thread.moved"))
  await router.push(`/board/${target?.id ?? id.value}/${view.value.post.uid}`)
}

const download = async (fileUid: number) => {
  if (!view.value) return
  if (!auth.isLoggedIn) {
    await router.push({ name: "login", query: { redirect: route.fullPath } })
    return
  }
  const response = await boardApi.download(view.value.config.uid, fileUid)
  if (!response.success) return toast.error(response.error)
  window.location.assign(apiResourceUrl(response.result.path))
}

const showOriginal = async (fileUid: number) => {
  if (!view.value) return
  const response = await boardApi.originalImage(view.value.config.uid, fileUid)
  if (!response.success) return toast.error(response.error)
  originalImage.value = apiResourceUrl(response.result.path)
  imageOpen.value = true
}

const updateTradeStatus = async (status: number) => {
  if (!view.value || !trade.value || tradeStatusSaving.value) return
  tradeStatusSaving.value = true
  try {
    const response = await tradeApi.status(view.value.config.uid, view.value.post.uid, status)
    if (!response.success) return toast.error(response.error)
    trade.value.status = status as TradeInfo["status"]
    toast.success(t("thread.statusUpdated"))
  } finally {
    tradeStatusSaving.value = false
  }
}

watch(() => route.fullPath, load, { immediate: true })
</script>

<template>
  <PageLoading v-if="loading" />
  <EmptyState
    v-else-if="error || !view"
    :title="$t('thread.unavailable')"
    :message="error || $t('thread.missing')"
    ><Button as-child variant="outline"
      ><RouterLink :to="`/board/${id}`"><List />{{ $t("board.back") }}</RouterLink></Button
    ></EmptyState
  >
  <div v-else class="space-y-4">
    <article class="overflow-hidden rounded-lg border bg-card">
      <div class="flex">
        <aside class="hidden w-12 shrink-0 justify-center bg-muted/40 py-4 sm:flex">
          <VoteControl :score="view.post.like" :liked="view.post.liked" @toggle="vote" />
        </aside>
        <div class="min-w-0 flex-1 p-4 sm:p-6">
          <div class="mb-3 flex flex-wrap items-center gap-2">
            <Badge v-if="view.post.status === STATUS.NOTICE" variant="secondary">{{
              $t("post.pinned")
            }}</Badge
            ><RouterLink
              :to="`/board/${view.config.id}`"
              class="text-xs font-semibold hover:underline"
              >t/{{ view.config.id }}</RouterLink
            ><UserLine
              :uid="view.post.writer.uid"
              :name="view.post.writer.name"
              :profile="view.post.writer.profile"
              :timestamp="view.post.submitted"
              compact
            />
          </div>
          <h1 class="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {{ recoverChars(view.post.title) }}
          </h1>
          <div
            v-if="trade"
            class="mt-4 grid gap-2 rounded-lg border bg-muted/35 p-4 text-sm sm:grid-cols-4"
          >
            <p>
              <span class="block text-xs text-muted-foreground">{{ $t("thread.price") }}</span
              ><strong>{{
                trade.priceType === 2 ? $t("post.free") : formatPrice(trade.price, trade.currency)
              }}</strong>
            </p>
            <p>
              <span class="block text-xs text-muted-foreground">{{
                $t("thread.brandCondition")
              }}</span
              ><strong
                >{{ trade.brand || "—" }} · {{ conditionLabels[trade.productCondition] }}</strong
              >
            </p>
            <p>
              <span class="block text-xs text-muted-foreground">{{ $t("thread.location") }}</span
              ><strong>{{ trade.location || $t("thread.notSpecified") }}</strong>
            </p>
            <p>
              <span class="block text-xs text-muted-foreground">{{ $t("thread.status") }}</span>
              <strong>{{ statusLabels[trade.status] }}</strong>
            </p>
          </div>
          <div v-if="trade && canManage" class="mt-3 flex flex-wrap gap-2">
            <Button
              v-for="(label, status) in statusLabels"
              :key="label"
              size="sm"
              :variant="trade.status === status ? 'default' : 'outline'"
              :disabled="tradeStatusSaving"
              @click="updateTradeStatus(status)"
              >{{ label }}</Button
            >
          </div>
          <div
            v-if="view.images.length"
            class="mt-5 grid gap-2"
            :class="view.images.length > 1 ? 'sm:grid-cols-2' : ''"
          >
            <button
              v-for="image in view.images"
              :key="image.file.uid"
              class="overflow-hidden rounded-lg bg-black"
              @click="showOriginal(image.file.uid)"
            >
              <img
                :src="image.thumbnail.large || image.thumbnail.small"
                :alt="image.description || view.post.title"
                class="max-h-[680px] w-full object-contain"
              />
            </button>
          </div>
          <HtmlContent :html="view.post.content" class="mt-6" />
          <div v-if="view.tags.length" class="mt-6 flex flex-wrap gap-2">
            <RouterLink
              v-for="tag in view.tags"
              :key="tag.uid"
              :to="`/board/${view.config.id}/search/3/${encodeURIComponent(tag.name)}/1`"
              ><Badge variant="secondary">#{{ tag.name }}</Badge></RouterLink
            >
          </div>
          <div v-if="view.files.length" class="mt-6 rounded-lg border">
            <button
              v-for="file in view.files"
              :key="file.uid"
              class="flex w-full items-center gap-3 border-b p-3 text-left text-sm last:border-0 hover:bg-accent"
              @click="download(file.uid)"
            >
              <File class="size-4 text-primary" /><span class="min-w-0 flex-1 truncate">{{
                file.name
              }}</span
              ><span class="text-xs text-muted-foreground">{{ formatBytes(file.size) }}</span
              ><Download class="size-4" />
            </button>
          </div>
          <div class="mt-6 flex flex-wrap items-center gap-2 border-t pt-4 sm:hidden">
            <VoteControl
              :score="view.post.like"
              :liked="view.post.liked"
              horizontal
              @toggle="vote"
            />
          </div>
          <div v-if="canManage" class="mt-4 flex flex-wrap gap-2">
            <Button as-child variant="outline" size="sm"
              ><RouterLink :to="`/board/${id}/${postUid}/edit`"
                ><Pencil />{{ $t("common.edit") }}</RouterLink
              ></Button
            ><Button v-if="view.isAdmin" variant="outline" size="sm" @click="prepareMove"
              ><Move />{{ $t("thread.move") }}</Button
            ><Button variant="destructive" size="sm" @click="deleteOpen = true"
              ><Trash2 />{{ $t("common.remove") }}</Button
            >
          </div>
        </div>
      </div>
    </article>
    <div class="flex justify-between">
      <Button v-if="view.prevPostUid" as-child variant="ghost"
        ><RouterLink :to="`/board/${id}/${view.prevPostUid}`"
          ><ArrowLeft />{{ $t("thread.previous") }}</RouterLink
        ></Button
      ><span v-else /><Button v-if="view.nextPostUid" as-child variant="ghost"
        ><RouterLink :to="`/board/${id}/${view.nextPostUid}`"
          >{{ $t("thread.next") }}<ArrowRight /></RouterLink
      ></Button>
    </div>
    <CommentSection
      :board-uid="view.config.uid"
      :post-uid="view.post.uid"
      :is-admin="view.isAdmin"
    />
    <Card v-if="view.writerPosts.length || view.writerComments.length"
      ><CardHeader
        ><CardTitle>{{
          $t("thread.moreFrom", { name: view.post.writer.name })
        }}</CardTitle></CardHeader
      ><CardContent class="grid gap-4 sm:grid-cols-2"
        ><div>
          <h3 class="font-label mb-2 text-xs font-semibold uppercase text-muted-foreground">
            {{ $t("thread.recentPosts") }}
          </h3>
          <RouterLink
            v-for="post in view.writerPosts"
            :key="post.postUid"
            :to="`/board/${post.board.id}/${post.postUid}`"
            class="block truncate py-1.5 text-sm hover:text-primary"
            >{{ post.title }}
            <span class="text-xs text-muted-foreground"
              >· {{ formatNumber(post.comment) }}</span
            ></RouterLink
          >
        </div>
        <div>
          <h3 class="font-label mb-2 text-xs font-semibold uppercase text-muted-foreground">
            {{ $t("thread.recentComments") }}
          </h3>
          <RouterLink
            v-for="comment in view.writerComments"
            :key="`${comment.postUid}-${comment.submitted}`"
            :to="`/board/${comment.board.id}/${comment.postUid}`"
            class="block truncate py-1.5 text-sm hover:text-primary"
            >{{ plainText(comment.content) }}</RouterLink
          >
        </div></CardContent
      ></Card
    >
  </div>

  <Dialog
    v-model="deleteOpen"
    :title="$t('thread.removeTitle')"
    :description="$t('thread.removeDescription')"
    width="sm"
    ><p class="text-sm text-muted-foreground">
      {{ $t("thread.removeWarning") }}
    </p>
    <template #footer
      ><Button variant="ghost" @click="deleteOpen = false">{{ $t("common.cancel") }}</Button
      ><Button variant="destructive" @click="removePost">{{
        $t("thread.removePost")
      }}</Button></template
    ></Dialog
  >
  <Dialog
    v-model="moveOpen"
    :title="$t('thread.moveTitle')"
    :description="$t('thread.moveDescription')"
    width="sm"
    ><SelectField v-model="targetBoardUid"
      ><option v-for="target in moveTargets" :key="target.uid" :value="target.uid">
        {{ target.name }} (t/{{ target.id }})
      </option></SelectField
    ><template #footer
      ><Button variant="ghost" @click="moveOpen = false">{{ $t("common.cancel") }}</Button
      ><Button :disabled="!targetBoardUid" @click="movePost">{{
        $t("thread.move")
      }}</Button></template
    ></Dialog
  >
  <Dialog v-model="imageOpen" :title="$t('thread.originalImage')" width="xl"
    ><div class="rounded-lg bg-black p-1">
      <img
        v-if="originalImage"
        :src="originalImage"
        :alt="$t('thread.originalAttachment')"
        class="mx-auto max-h-[78vh] max-w-full object-contain"
      /></div
  ></Dialog>
</template>
