<template>
  <v-row no-gutters>
    <v-col class="pa-1">
      <dashboard-latest-post></dashboard-latest-post>
    </v-col>

    <v-col class="pa-1">
      <dashboard-latest-comment></dashboard-latest-comment>
    </v-col>

    <v-col class="pa-1">
      <dashboard-latest-report></dashboard-latest-report>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useAdminDashboardStore } from "../../../store/admin/dashboard/general"
import { useUtilStore } from "../../../store/util"
import DashboardLatestPost from "./latest/DashboardLatestPost.vue"
import DashboardLatestComment from "./latest/DashboardLatestComment.vue"
import DashboardLatestReport from "./latest/DashboardLatestReport.vue"

const dashboard = useAdminDashboardStore()
const util = useUtilStore()
</script>

<style>
.more {
  position: absolute;
  top: 8px;
  right: 10px;
}
</style>
