<template>
  <v-row no-gutters>
    <v-col class="pa-1">
      <dashboard-statistic-visit></dashboard-statistic-visit>
    </v-col>

    <v-col class="pa-1">
      <dashboard-statistic-member></dashboard-statistic-member>
    </v-col>

    <v-col class="pa-1">
      <dashboard-statistic-post></dashboard-statistic-post>
    </v-col>
  </v-row>

  <v-row no-gutters>
    <v-col class="pa-1">
      <dashboard-statistic-comment></dashboard-statistic-comment>
    </v-col>

    <v-col class="pa-1">
      <dashboard-statistic-attachment></dashboard-statistic-attachment>
    </v-col>

    <v-col class="pa-1">
      <dashboard-statistic-inserted-image></dashboard-statistic-inserted-image>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useAdminDashboardStore } from "../../../store/admin/dashboard/general"
import DashboardStatisticVisit from "./statistic/DashboardStatisticVisit.vue"
import DashboardStatisticMember from "./statistic/DashboardStatisticMember.vue"
import DashboardStatisticPost from "./statistic/DashboardStatisticPost.vue"
import DashboardStatisticComment from "./statistic/DashboardStatisticComment.vue"
import DashboardStatisticAttachment from "./statistic/DashboardStatisticAttachment.vue"
import DashboardStatisticInsertedImage from "./statistic/DashboardStatisticInsertedImage.vue"

const dashboard = useAdminDashboardStore()
</script>
