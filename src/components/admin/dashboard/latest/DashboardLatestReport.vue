<template>
  <v-card class="mt-3 mb-3" rounded="xl" :color="COLOR.ADMIN.MAIN">
    <v-card-title
      >최근 신고
      <div class="more">
        <v-btn
          append-icon="mdi-chevron-right"
          rounded="xl"
          elevation="0"
          @click="util.go('adminReport')"
          size="small"
          :color="COLOR.ADMIN.MAIN"
          >더 보기</v-btn
        >
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-list density="compact">
      <v-list-item
        v-for="(report, index) in dashboard.reports"
        :key="index"
        @click="util.go('adminReportView', '', report.uid)"
        :prepend-avatar="
          TSBOARD.PREFIX +
          (report.writer.profile.length < 1 ? '/no-profile.svg' : report.writer.profile)
        "
      >
        <v-list-item-title>{{ report.content }}</v-list-item-title>
        <v-tooltip activator="parent">신고 내역을 확인하러 갑니다.</v-tooltip>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { COLOR, TSBOARD } from "../../../../../tsboard.config"
import { useAdminDashboardStore } from "../../../../store/admin/dashboard/general"
import { useUtilStore } from "../../../../store/util"

const dashboard = useAdminDashboardStore()
const util = useUtilStore()
</script>
