<template>
  <v-card class="mt-3 title" rounded="xl">
    <template v-slot:title>방문자수</template>
    <template v-slot:append>
      <v-chip size="small" :color="COLOR.ADMIN.MAIN" prepend-icon="mdi-account-arrow-right-outline"
        >오늘 {{ dashboard.visit.values.at(-1) || 0 }}명</v-chip
      >
    </template>
    <v-divider></v-divider>
    <v-sheet class="mx-auto" :color="COLOR.ADMIN.BACKGROUND">
      <v-sparkline
        :model-value="dashboard.visit.values"
        :color="COLOR.ADMIN.MAIN"
        :line-width="3"
        :padding="16"
        smooth
        class="pb-3"
        :height="150"
        stroke-linecap="round"
        auto-draw
      >
        <template v-slot:label="item"> {{ item.value }} 명 </template>
      </v-sparkline>
    </v-sheet>

    <v-card-actions class="pa-0 ml-3 mr-3">
      <v-chip :color="COLOR.ADMIN.MAIN" prepend-icon="mdi-account-arrow-right-outline" size="small"
        >어제 {{ dashboard.visit.values.at(-2) || 0 }}명</v-chip
      >
      <v-spacer></v-spacer>
      <v-chip :color="COLOR.ADMIN.MAIN" prepend-icon="mdi-account-group-outline" size="small"
        >총합 {{ util.num(dashboard.visit.total) }}명</v-chip
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { COLOR } from "../../../../../tsboard.config"
import { useAdminDashboardStore } from "../../../../store/admin/dashboard/general"
import { useUtilStore } from "../../../../store/util"

const dashboard = useAdminDashboardStore()
const util = useUtilStore()
</script>
