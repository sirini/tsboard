<script setup lang="ts">
import {
  FileImage,
  Files,
  MessageCircle,
  MessagesSquare,
  Server,
  UserPlus,
  Users,
} from "lucide-vue-next"
import { onMounted, ref } from "vue"
import { dashboardApi } from "@/api/admin"
import DashboardMetric from "@/components/admin/DashboardMetric.vue"
import PageHeader from "@/components/common/PageHeader.vue"
import { Alert } from "@/components/ui/alert"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { formatBytes } from "@/lib/utils"
import type { DashboardItems, DashboardStatistics } from "@/types/admin"
import { TSBOARD } from "../../../tsboard.config"

const stats = ref<DashboardStatistics | null>(null)
const items = ref<DashboardItems | null>(null)
const usage = ref(0)
const goapi = ref<{ version: string; apiContract: string } | null>(null)
const loading = ref(true)
const error = ref("")

const load = async () => {
  loading.value = true
  try {
    const [statResponse, itemResponse, usageResponse, versionResponse] = await Promise.all([
      dashboardApi.statistics(14),
      dashboardApi.items(6),
      dashboardApi.usage(),
      dashboardApi.version().catch(() => null),
    ])
    if (!statResponse.success) error.value = statResponse.error
    else stats.value = statResponse.result
    if (itemResponse.success) items.value = itemResponse.result
    if (usageResponse.success) usage.value = usageResponse.result
    if (versionResponse) goapi.value = versionResponse
  } catch (reason) {
    error.value = String(reason)
  } finally {
    loading.value = false
  }
}
onMounted(load)
</script>

<template>
  <PageHeader
    :eyebrow="$t('admin.eyebrow')"
    :title="$t('admin.overview')"
    :description="$t('admin.dashboardDescription')"
  />
  <div v-if="loading" class="py-20 text-center">
    <Spinner :label="$t('admin.loadingDashboard')" />
  </div>
  <Alert v-else-if="error" variant="destructive" :title="$t('admin.dashboardUnavailable')">{{
    error
  }}</Alert>
  <div v-else-if="stats" class="space-y-5">
    <Alert
      v-if="
        goapi && (goapi.version !== TSBOARD.version || goapi.apiContract !== TSBOARD.apiContract)
      "
      variant="destructive"
      :title="$t('admin.versionMismatch')"
      >{{
        $t("admin.versionMismatchDescription", {
          frontend: TSBOARD.version,
          expected: TSBOARD.version,
          contract: TSBOARD.apiContract,
          backend: goapi.version,
          backendContract: goapi.apiContract,
        })
      }}</Alert
    >
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <DashboardMetric
        :label="$t('admin.visits')"
        :series="stats.visit"
        :icon="Users"
      /><DashboardMetric
        :label="$t('admin.members')"
        :series="stats.member"
        :icon="UserPlus"
      /><DashboardMetric
        :label="$t('admin.posts')"
        :series="stats.post"
        :icon="MessagesSquare"
      /><DashboardMetric
        :label="$t('admin.comments')"
        :series="stats.reply"
        :icon="MessageCircle"
      /><DashboardMetric
        :label="$t('admin.files')"
        :series="stats.file"
        :icon="Files"
      /><DashboardMetric :label="$t('admin.images')" :series="stats.image" :icon="FileImage" />
    </div>
    <div class="grid gap-4 lg:grid-cols-3">
      <Card
        ><CardHeader
          ><CardTitle class="flex items-center gap-2"
            ><Server class="size-4" />{{ $t("admin.runtime") }}</CardTitle
          ></CardHeader
        ><CardContent class="space-y-3 text-sm"
          ><div class="flex justify-between">
            <span class="text-muted-foreground">TSBOARD</span
            ><Badge variant="outline">{{ TSBOARD.version }}</Badge>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">GOAPI</span
            ><Badge :variant="goapi?.version === TSBOARD.version ? 'secondary' : 'destructive'">{{
              goapi?.version ?? $t("admin.unavailable")
            }}</Badge>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">{{ $t("admin.apiContract") }}</span
            ><Badge variant="outline">{{ goapi?.apiContract ?? "—" }}</Badge>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">{{ $t("admin.uploads") }}</span
            ><strong>{{ formatBytes(usage) }}</strong>
          </div></CardContent
        ></Card
      ><Card
        ><CardHeader
          ><CardTitle>{{ $t("admin.newestGroups") }}</CardTitle></CardHeader
        ><CardContent
          ><RouterLink
            v-for="group in items?.groups"
            :key="group.uid"
            to="/admin/boards"
            class="flex justify-between border-b py-2 text-sm last:border-0 hover:text-primary"
            ><span>{{ group.name }}</span
            ><span class="text-muted-foreground">#{{ group.uid }}</span></RouterLink
          ></CardContent
        ></Card
      ><Card
        ><CardHeader
          ><CardTitle>{{ $t("admin.newestMembers") }}</CardTitle></CardHeader
        ><CardContent
          ><RouterLink
            v-for="member in items?.members"
            :key="member.uid"
            :to="`/user/${member.uid}`"
            class="flex items-center gap-2 border-b py-2 text-sm last:border-0 hover:text-primary"
            ><Avatar :src="member.profile" class="size-7" /><span class="min-w-0 flex-1 truncate">{{
              member.name
            }}</span
            ><span class="text-xs text-muted-foreground">#{{ member.uid }}</span></RouterLink
          ></CardContent
        ></Card
      >
    </div>
  </div>
</template>
