<script setup lang="ts">
import { Flame, Plus, RefreshCw, Search } from "lucide-vue-next"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { toast } from "vue-sonner"
import { boardApi } from "@/api/board"
import { editorApi } from "@/api/editor"
import { homeApi } from "@/api/home"
import EmptyState from "@/components/common/EmptyState.vue"
import PageHeader from "@/components/common/PageHeader.vue"
import PageLoading from "@/components/common/PageLoading.vue"
import PostFeedCard from "@/components/post/PostFeedCard.vue"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SelectField } from "@/components/ui/select"
import { SEARCH, type Search as SearchType } from "@/types/common"
import type { HomePost } from "@/types/content"
import type { BoardListItem } from "@/types/board"
import { useAuthStore } from "@/stores/auth"
import { useHomeStore } from "@/stores/home"

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const home = useHomeStore()
const posts = ref<HomePost[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const error = ref("")
const searchOption = ref<number>(SEARCH.TITLE)
const boardUids = new Map<string, number>()
const isSearch = computed(() => route.name === "search")
const keyword = computed(() => String(route.params.keyword ?? ""))
const firstBoardId = computed(() => home.groups.flatMap((group) => group.boards)[0]?.id ?? "")

const query = (sinceUid = 0) => ({
  sinceUid,
  bunch: 20,
  option: isSearch.value ? (Number(route.params.option) as SearchType) : SEARCH.NONE,
  keyword: keyword.value,
})

const load = async () => {
  searchOption.value = isSearch.value ? Number(route.params.option) : SEARCH.TITLE
  loading.value = true
  error.value = ""
  try {
    const response = await homeApi.posts(query())
    if (!response.success) {
      error.value = response.error
      return
    }
    posts.value = response.result
  } catch (reason) {
    error.value = String(reason)
  } finally {
    loading.value = false
  }
}

const changeSearchOption = async () => {
  if (!isSearch.value) return
  await router.replace({
    name: "search",
    params: { option: searchOption.value, keyword: keyword.value },
  })
}

const loadMore = async () => {
  const sinceUid = posts.value.at(-1)?.uid ?? 0
  if (!sinceUid) return
  loadingMore.value = true
  try {
    const response = await homeApi.posts(query(sinceUid))
    if (response.success) posts.value.push(...response.result)
    else toast.error(response.error)
  } finally {
    loadingMore.value = false
  }
}

const vote = async (post: BoardListItem) => {
  if (!auth.isLoggedIn) {
    await router.push({ name: "login", query: { redirect: route.fullPath } })
    return
  }
  const homePost = posts.value.find((item) => item.uid === post.uid)
  if (!homePost) return
  let boardUid = boardUids.get(homePost.id)
  if (!boardUid) {
    const config = await editorApi.config(homePost.id)
    if (!config.success) return toast.error(config.error)
    boardUid = config.result.config.uid
    boardUids.set(homePost.id, boardUid)
  }
  const response = await boardApi.like(boardUid, post.uid, post.liked)
  if (!response.success) {
    toast.error(response.error)
    return
  }
  post.liked = !post.liked
  post.like += post.liked ? 1 : -1
}

watch(() => route.fullPath, load, { immediate: true })
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      :eyebrow="isSearch ? $t('common.search') : $t('home.frontPage')"
      :title="isSearch ? $t('home.results', { keyword }) : $t('home.today')"
      :description="isSearch ? $t('home.searchDescription') : $t('home.intro')"
    >
      <Button v-if="auth.isLoggedIn && firstBoardId" as-child
        ><RouterLink :to="`/board/${firstBoardId}/write`"
          ><Plus />{{ $t("home.createPost") }}</RouterLink
        ></Button
      >
    </PageHeader>
    <Card
      ><CardContent class="flex items-center gap-2 p-2"
        ><Button variant="secondary" size="sm"><Flame />{{ $t("home.latest") }}</Button
        ><Button variant="ghost" size="sm" @click="load"
          ><RefreshCw />{{ $t("common.refresh") }}</Button
        >
        <div v-if="isSearch" class="ml-auto flex items-center gap-2">
          <Search class="size-4 text-muted-foreground" /><SelectField
            v-model="searchOption"
            class="w-32"
            :aria-label="$t('common.search')"
            @change="changeSearchOption"
            ><option :value="SEARCH.TITLE">{{ $t("search.title") }}</option>
            <option :value="SEARCH.CONTENT">{{ $t("search.content") }}</option>
            <option :value="SEARCH.WRITER">{{ $t("search.author") }}</option>
            <option :value="SEARCH.TAG">{{ $t("search.tag") }}</option></SelectField
          >
        </div></CardContent
      ></Card
    >
    <PageLoading v-if="loading" />
    <EmptyState v-else-if="error" :title="$t('home.feedError')" :message="error"
      ><Button variant="outline" @click="load">{{ $t("common.tryAgain") }}</Button></EmptyState
    >
    <EmptyState
      v-else-if="!posts.length"
      :title="$t('home.noPosts')"
      :message="$t('home.noPostsDescription')"
    />
    <div v-else class="space-y-3">
      <PostFeedCard
        v-for="post in posts"
        :key="`${post.id}-${post.uid}`"
        :post="post"
        :board-id="post.id"
        :board-name="post.id"
        :board-type="post.type"
        @vote="vote"
      />
      <div class="py-3 text-center">
        <Button variant="outline" :disabled="loadingMore" @click="loadMore">{{
          loadingMore ? $t("common.loading") : $t("home.loadMore")
        }}</Button>
      </div>
    </div>
  </div>
</template>
