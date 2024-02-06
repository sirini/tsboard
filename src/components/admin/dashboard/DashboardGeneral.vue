<template>
  <v-card elevation="0">
    <v-list>
      <v-list-subheader>간단 통계 (방문자수 / 회원 수 / 게시글 수)</v-list-subheader>
      <v-list-item>
        <dashboard-general-stat></dashboard-general-stat>
      </v-list-item>
      <v-list-subheader>최근 활동 (최신글 / 최신 댓글 / 최근 신고)</v-list-subheader>
      <v-list-item>
        <dashboard-general-latest></dashboard-general-latest>
      </v-list-item>
      <v-list-subheader>관리 링크 (그룹 / 게시판 / 회원)</v-list-subheader>
      <v-list-item>
        <dashboard-general-manage-link></dashboard-general-manage-link>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useAdminDashboardStore } from "../../../store/admin/dashboard/general"
import DashboardGeneralStat from "./DashboardGeneralStat.vue"
import DashboardGeneralLatest from "./DashboardGeneralLatest.vue"
import DashboardGeneralManageLink from "./DashboardGeneralManageLink.vue"

const general = useAdminDashboardStore()
onMounted(() => {
  general.loadStatistics()
  general.loadLatests()
})
</script>
