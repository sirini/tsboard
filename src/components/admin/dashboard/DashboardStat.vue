<template>
  <v-card elevation="0" rounded="0" :loading="dashboard.loading">
    <v-list>
      <v-list-item class="text-center">
        <v-btn-toggle
          v-model="dashboard.days"
          mandatory
          :color="COLOR.ADMIN.MAIN"
          rounded="pill"
          variant="outlined"
        >
          <v-btn :value="7" @click="changeTerm(7)">1주</v-btn>
          <v-btn :value="14" @click="changeTerm(14)">2주</v-btn>
          <v-btn :value="30" @click="changeTerm(30)">1달</v-btn>
          <v-btn :value="90" @click="changeTerm(90)">분기</v-btn>
          <v-btn :value="180" @click="changeTerm(180)">반기</v-btn>
          <v-btn :value="360" @click="changeTerm(360)">1년</v-btn>
        </v-btn-toggle>
      </v-list-item>
      <v-list-item>
        <dashboard-stat-visit></dashboard-stat-visit>
      </v-list-item>
      <v-list-item>
        <dashboard-stat-member></dashboard-stat-member>
      </v-list-item>
      <v-list-item>
        <dashboard-stat-post></dashboard-stat-post>
      </v-list-item>
      <v-list-item>
        <dashboard-stat-comment></dashboard-stat-comment>
      </v-list-item>
      <v-list-item>
        <dashboard-stat-attachment></dashboard-stat-attachment>
      </v-list-item>
      <v-list-item>
        <dashboard-stat-image></dashboard-stat-image>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useAdminDashboardStore } from "../../../store/admin/dashboard/general"
import DashboardStatVisit from "./DashboardStatVisit.vue"
import DashboardStatMember from "./DashboardStatMember.vue"
import DashboardStatPost from "./DashboardStatPost.vue"
import DashboardStatComment from "./DashboardStatComment.vue"
import DashboardStatAttachment from "./DashboardStatAttachment.vue"
import DashboardStatImage from "./DashboardStatImage.vue"
import { COLOR } from "../../../../tsboard.config"

const dashboard = useAdminDashboardStore()

onMounted(async () => {
  dashboard.days = 30
  dashboard.clearStatistics()
  await dashboard.loadStatistics()
})

// 통계 기간 변경하기
function changeTerm(days: number): void {
  dashboard.days = days
  dashboard.loadStatistics()
}
</script>
