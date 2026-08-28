<script setup lang="ts">
import {
  Ban,
  CalendarDays,
  Edit,
  Flag,
  Mail,
  MessageCircle,
  Settings,
  Shield,
  Trash2,
} from "lucide-vue-next"
import { computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { toast } from "vue-sonner"
import { authApi } from "@/api/auth"
import { boardApi } from "@/api/board"
import EmptyState from "@/components/common/EmptyState.vue"
import PageLoading from "@/components/common/PageLoading.vue"
import ChatDialog from "@/components/profile/ChatDialog.vue"
import ProfileEditDialog from "@/components/profile/ProfileEditDialog.vue"
import ReportUserDialog from "@/components/profile/ReportUserDialog.vue"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { formatDate, plainText, recoverChars } from "@/lib/utils"
import type { WriterLatestComment, WriterLatestPost } from "@/types/board"
import type { UserInfo } from "@/types/user"
import { useAuthStore } from "@/stores/auth"

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()
const profile = ref<UserInfo | null>(null)
const posts = ref<WriterLatestPost[]>([])
const comments = ref<WriterLatestComment[]>([])
const loading = ref(true)
const error = ref("")
const editOpen = ref(false)
const reportOpen = ref(false)
const chatOpen = ref(false)
const deleteOpen = ref(false)
const blockedByMe = ref(false)
const userUid = computed(() => Number(route.params.userUid))
const isOwn = computed(() => auth.user.uid === userUid.value)

const load = async () => {
  loading.value = true
  error.value = ""
  try {
    const [userResponse, activityResponse] = await Promise.all([
      authApi.user(userUid.value),
      boardApi.userLatest(userUid.value, 10),
    ])
    if (!userResponse.success) {
      error.value = userResponse.error
      return
    }
    profile.value = {
      ...userResponse.result,
      name: recoverChars(userResponse.result.name),
      signature: recoverChars(userResponse.result.signature),
    }
    if (activityResponse.success) {
      posts.value = activityResponse.result.posts
      comments.value = activityResponse.result.comments
    }
    if (auth.isLoggedIn && !isOwn.value) {
      const reportResponse = await authApi.reportStatus(userUid.value)
      if (reportResponse.success) blockedByMe.value = reportResponse.result.isBannedByMe
    }
  } catch (reason) {
    error.value = String(reason)
  } finally {
    loading.value = false
  }
}

const toggleBlock = async () => {
  if (!profile.value) return
  const next = !blockedByMe.value
  const response = await authApi.block(profile.value.uid, next)
  if (!response.success) return toast.error(response.error)
  blockedByMe.value = next
  toast.success(next ? t("profile.blockedMember") : t("profile.unblockedMember"))
}

const deleteAccount = async () => {
  const response = await authApi.deleteAccount()
  if (!response.success) return toast.error(response.error)
  auth.expire()
  toast.success(t("profile.deleted"))
  await router.push("/")
}

watch(userUid, load, { immediate: true })
</script>

<template>
  <PageLoading v-if="loading" />
  <EmptyState v-else-if="error || !profile" :title="$t('profile.unavailable')" :message="error" />
  <div v-else class="space-y-4">
    <Card class="overflow-hidden"
      ><div class="h-24 bg-gradient-to-r from-primary/75 via-primary/45 to-accent" />
      <CardContent class="relative p-5 pt-0"
        ><Avatar
          :src="profile.profile"
          :alt="profile.name"
          class="-mt-10 size-20 border-4 border-card"
        />
        <div class="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-bold">{{ profile.name }}</h1>
              <Badge v-if="profile.admin" variant="secondary"
                ><Shield class="mr-1 size-3" />{{ $t("profile.admin") }}</Badge
              ><Badge v-if="profile.blocked" variant="destructive">{{
                $t("profile.blocked")
              }}</Badge>
            </div>
            <p class="mt-1 max-w-xl text-sm text-muted-foreground">
              {{ profile.signature || $t("profile.noBio") }}
            </p>
            <p class="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays class="size-4" />{{
                $t("profile.joined", { date: formatDate(profile.signup), level: profile.level })
              }}
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <Button v-if="isOwn" variant="outline" @click="editOpen = true"
              ><Edit />{{ $t("profile.edit") }}</Button
            ><template v-else-if="auth.isLoggedIn"
              ><Button variant="outline" @click="chatOpen = true"
                ><Mail />{{ $t("profile.message") }}</Button
              ><Button variant="outline" @click="toggleBlock"
                ><Ban />{{ blockedByMe ? $t("profile.unblock") : $t("profile.block") }}</Button
              ><Button variant="outline" class="text-destructive" @click="reportOpen = true"
                ><Flag />{{ $t("profile.report") }}</Button
              ></template
            ><Button v-if="isOwn" variant="destructive" size="sm" @click="deleteOpen = true"
              ><Trash2 />{{ $t("profile.deleteAccount") }}</Button
            >
          </div>
        </div></CardContent
      ></Card
    >
    <div class="grid gap-4 md:grid-cols-2">
      <Card
        ><CardHeader
          ><CardTitle class="flex items-center gap-2"
            ><Settings class="size-4" />{{ $t("profile.recentPosts") }}</CardTitle
          ></CardHeader
        ><CardContent
          ><RouterLink
            v-for="post in posts"
            :key="post.postUid"
            :to="`/board/${post.board.id}/${post.postUid}`"
            class="block border-b py-3 last:border-0 hover:text-primary"
            ><p class="truncate text-sm font-medium">{{ post.title }}</p>
            <p class="mt-1 text-xs text-muted-foreground">
              t/{{ post.board.id }} · {{ $t("post.comments", { count: post.comment }) }} ·
              {{ $t("profile.votes", { count: post.like }) }}
            </p></RouterLink
          >
          <p v-if="!posts.length" class="py-8 text-center text-sm text-muted-foreground">
            {{ $t("profile.noRecentPosts") }}
          </p></CardContent
        ></Card
      ><Card
        ><CardHeader
          ><CardTitle class="flex items-center gap-2"
            ><MessageCircle class="size-4" />{{ $t("profile.recentComments") }}</CardTitle
          ></CardHeader
        ><CardContent
          ><RouterLink
            v-for="comment in comments"
            :key="`${comment.postUid}-${comment.submitted}`"
            :to="`/board/${comment.board.id}/${comment.postUid}`"
            class="block border-b py-3 last:border-0 hover:text-primary"
            ><p class="line-clamp-2 text-sm">{{ plainText(comment.content) }}</p>
            <p class="mt-1 text-xs text-muted-foreground">
              t/{{ comment.board.id }} · {{ $t("profile.votes", { count: comment.like }) }}
            </p></RouterLink
          >
          <p v-if="!comments.length" class="py-8 text-center text-sm text-muted-foreground">
            {{ $t("profile.noRecentComments") }}
          </p></CardContent
        ></Card
      >
    </div>
  </div>
  <ProfileEditDialog
    v-if="profile"
    v-model="editOpen"
    :name="profile.name"
    :signature="profile.signature"
    @saved="load"
  />
  <ReportUserDialog
    v-if="profile"
    v-model="reportOpen"
    :user-uid="profile.uid"
    :user-name="profile.name"
    @reported="blockedByMe = $event"
  />
  <ChatDialog v-if="profile" v-model="chatOpen" :user-uid="profile.uid" :user-name="profile.name" />
  <Dialog
    v-model="deleteOpen"
    :title="$t('profile.deleteTitle')"
    :description="$t('profile.deleteDescription')"
    width="sm"
    ><p class="text-sm text-muted-foreground">
      {{ $t("profile.deleteWarning") }}
    </p>
    <template #footer
      ><Button variant="ghost" @click="deleteOpen = false">{{ $t("common.cancel") }}</Button
      ><Button variant="destructive" @click="deleteAccount">{{
        $t("profile.deleteEverything")
      }}</Button></template
    ></Dialog
  >
</template>
