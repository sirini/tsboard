<template>
  <v-card elevation="0" rounded="0">
    <v-list>
      <v-list-subheader>간단 통계 (방문자수 / 회원 수 / 게시글 수)</v-list-subheader>
      <v-list-item>
        <dashboard-general-statistic></dashboard-general-statistic>
      </v-list-item>
      <v-list-subheader>최근 활동 (최신글 / 최신 댓글 / 최근 신고)</v-list-subheader>
      <v-list-item>
        <dashboard-general-latest></dashboard-general-latest>
      </v-list-item>
      <v-list-subheader>관리 링크 (그룹 / 게시판 / 회원)</v-list-subheader>
      <v-list-item>
        <dashboard-general-item></dashboard-general-item>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useAdminStore } from "../../../store/admin/common"
import { useAdminDashboardStore } from "../../../store/admin/dashboard/general"
import { useAuthStore } from "../../../store/user/auth"
import DashboardGeneralStatistic from "./DashboardGeneralStatistic.vue"
import DashboardGeneralLatest from "./DashboardGeneralLatest.vue"
import DashboardGeneralItem from "./DashboardGeneralItem.vue"

const admin = useAdminStore()
const general = useAdminDashboardStore()
const auth = useAuthStore()
onMounted(() => {
  if (auth.user.uid !== 1) {
    admin.error(`그룹 관리자 이상만 사용 가능합니다.`, 10_000)
    return
  }
  general.loadStatistics()
  general.loadLatests()
  general.loadItems()
})
</script>
