<script setup lang="ts">
import { Hash, Plus, Search } from "lucide-vue-next"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { toast } from "vue-sonner"
import { boardApi } from "@/api/board"
import EmptyState from "@/components/common/EmptyState.vue"
import PageLoading from "@/components/common/PageLoading.vue"
import PostFeedCard from "@/components/post/PostFeedCard.vue"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PaginationBar } from "@/components/ui/pagination"
import { SelectField } from "@/components/ui/select"
import type {
  BoardConfig,
  BoardListItem,
  BoardListResult,
  TradeInfo,
  TradeListResult,
} from "@/types/board"
import { SEARCH, type Search as SearchType } from "@/types/common"
import { useAuthStore } from "@/stores/auth"

type FeedEntry = { post: BoardListItem; trade?: TradeInfo; notice?: boolean }
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const config = ref<BoardConfig | null>(null)
const entries = ref<FeedEntry[]>([])
const total = ref(0)
const loading = ref(true)
const error = ref("")
const isAdmin = ref(false)
const keyword = ref("")
const option = ref<number>(SEARCH.TITLE)
const page = computed(() => Math.max(1, Number(route.params.page ?? 1)))
const id = computed(() => String(route.params.id))

const normalize = (result: BoardListResult | TradeListResult) => {
  const trade = result as TradeListResult
  const isTrade = [...trade.notices, ...trade.posts].some((item) => "post" in item)
  if (isTrade) {
    return [
      ...trade.notices.map((item) => ({ ...item, notice: true })),
      ...trade.posts.map((item) => ({ ...item, notice: false })),
    ]
  }
  const board = result as BoardListResult
  return [
    ...board.notices.map((post) => ({ post, notice: true })),
    ...board.posts.map((post) => ({ post, notice: false })),
  ]
}

const load = async () => {
  loading.value = true
  error.value = ""
  try {
    const response = await boardApi.list({
      id: id.value,
      page: page.value,
      option: Number(route.params.option ?? SEARCH.NONE) as SearchType,
      keyword: String(route.params.keyword ?? ""),
    })
    if (!response.success) {
      error.value = response.error
      return
    }
    config.value = response.result.config
    total.value = response.result.totalPostCount
    isAdmin.value = response.result.isAdmin
    const blocked = new Set(response.result.blackList)
    entries.value = normalize(response.result).filter(
      (entry) => !blocked.has(entry.post.writer.uid),
    )
  } catch (reason) {
    error.value = String(reason)
  } finally {
    loading.value = false
  }
}

const search = async () => {
  const value = keyword.value.trim()
  if (!value) return
  await router.push(`/board/${id.value}/search/${option.value}/${encodeURIComponent(value)}/1`)
}

const changePage = (target: number) => {
  if (route.name === "board-search") {
    router.push(
      `/board/${id.value}/search/${route.params.option}/${route.params.keyword}/${target}`,
    )
  } else router.push(`/board/${id.value}/page/${target}`)
}

const vote = async (post: BoardListItem) => {
  if (!auth.isLoggedIn) {
    await router.push({ name: "login", query: { redirect: route.fullPath } })
    return
  }
  if (!config.value) return
  const response = await boardApi.like(config.value.uid, post.uid, post.liked)
  if (!response.success) return toast.error(response.error)
  post.liked = !post.liked
  post.like += post.liked ? 1 : -1
}

watch(() => route.fullPath, load, { immediate: true })
</script>

<template>
  <div class="space-y-4">
    <section v-if="config" class="overflow-hidden rounded-lg border bg-card">
      <div class="h-20 bg-gradient-to-r from-primary/85 via-primary/60 to-accent sm:h-24" />
      <div class="flex flex-wrap items-end justify-between gap-3 px-4 pb-4">
        <div class="-mt-6">
          <div
            class="mb-2 grid size-12 place-items-center rounded-full border-4 border-card bg-primary text-lg font-black text-primary-foreground"
          >
            t/
          </div>
          <h1 class="text-2xl font-bold">{{ config.name }}</h1>
          <p class="mt-1 text-sm text-muted-foreground">t/{{ config.id }} · {{ config.info }}</p>
        </div>
        <Button v-if="auth.isLoggedIn" as-child
          ><RouterLink :to="`/board/${config.id}/write`"
            ><Plus />{{ $t("home.createPost") }}</RouterLink
          ></Button
        >
      </div>
    </section>
    <Card v-if="config"
      ><CardContent class="flex flex-col gap-2 p-2 sm:flex-row"
        ><form class="flex flex-1 gap-2" @submit.prevent="search">
          <SelectField v-model="option" class="w-32"
            ><option :value="SEARCH.TITLE">{{ $t("search.title") }}</option>
            <option :value="SEARCH.CONTENT">{{ $t("search.content") }}</option>
            <option :value="SEARCH.WRITER">{{ $t("search.author") }}</option>
            <option :value="SEARCH.TAG">{{ $t("search.tag") }}</option>
            <option :value="SEARCH.CATEGORY">{{ $t("search.category") }}</option></SelectField
          >
          <div class="relative flex-1">
            <Search
              class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            /><Input
              v-model="keyword"
              class="pl-9"
              :placeholder="$t('search.communityPlaceholder')"
            />
          </div>
          <Button type="submit" variant="secondary">{{ $t("common.search") }}</Button>
        </form></CardContent
      ></Card
    >
    <div v-if="route.params.keyword" class="flex items-center gap-2 text-sm">
      <Badge variant="secondary"><Hash class="mr-1 size-3" />{{ route.params.keyword }}</Badge
      ><Button variant="link" size="sm" as-child
        ><RouterLink :to="`/board/${id}`">{{ $t("search.clear") }}</RouterLink></Button
      >
    </div>
    <PageLoading v-if="loading" />
    <EmptyState v-else-if="error" :title="$t('board.unavailable')" :message="error"
      ><Button variant="outline" @click="load">{{ $t("common.tryAgain") }}</Button></EmptyState
    >
    <EmptyState
      v-else-if="!entries.length"
      :title="$t('board.empty')"
      :message="$t('board.emptyDescription')"
      ><Button v-if="auth.isLoggedIn && config" as-child
        ><RouterLink :to="`/board/${config.id}/write`">{{
          $t("home.createPost")
        }}</RouterLink></Button
      ></EmptyState
    >
    <div v-else class="space-y-3">
      <PostFeedCard
        v-for="entry in entries"
        :key="entry.post.uid"
        :post="entry.post"
        :trade="entry.trade"
        :board-id="id"
        :board-name="config?.name"
        :board-type="config?.type"
        @vote="vote"
      /><PaginationBar
        v-if="config"
        class="pt-3"
        :page="page"
        :total="total"
        :page-size="config.rowCount || 20"
        @change="changePage"
      />
    </div>
  </div>
</template>
