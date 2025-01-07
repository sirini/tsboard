<template>
  <v-card rounded="xl" :color="COLOR.ADMIN.BACKGROUND" variant="outlined" class="mt-1">
    <template v-slot:title>
      <v-chip :color="COLOR.ADMIN.MAIN"
        ><strong>첨부파일 통계</strong>
        <v-divider vertical class="ml-3 mr-3"></v-divider>
        {{ dashboard.file.labels.at(0) || "" }} ~
        {{ dashboard.file.labels.at(-1) || "" }}
      </v-chip></template
    >
    <template v-slot:append>
      <v-chip :color="COLOR.ADMIN.MAIN" prepend-icon="mdi-content-save-plus-outline">
        <strong>오늘 {{ dashboard.file.values.at(-1) || 0 }}개 업로드됨</strong>
        <v-divider vertical class="ml-3 mr-3"></v-divider>
        최고 {{ Math.max(...dashboard.visit.values) }}개 업로드됨
      </v-chip>
    </template>

    <v-divider></v-divider>

    <v-sheet class="mx-auto">
      <v-sparkline
        v-if="dashboard.file.values.length < 20"
        :model-value="dashboard.file.values"
        :color="COLOR.ADMIN.MAIN"
        :line-width="1"
        :fill="true"
        :gradient="[COLOR.ADMIN.MAIN, COLOR.ADMIN.BACKGROUND, '#ffffff']"
        :padding="8"
        smooth
        :height="dashboard.height"
        auto-draw
        class="pb-3"
      >
        <template v-slot:label="item">
          {{ util.num(parseInt(item.value)) }}
        </template>
      </v-sparkline>

      <v-sparkline
        v-else
        :model-value="dashboard.file.values"
        :color="COLOR.ADMIN.MAIN"
        :line-width="1"
        :fill="true"
        :gradient="[COLOR.ADMIN.MAIN, COLOR.ADMIN.BACKGROUND, '#ffffff']"
        :padding="8"
        smooth
        :height="dashboard.height"
        auto-draw
        class="pb-3"
      ></v-sparkline>
    </v-sheet>

    <v-divider></v-divider>

    <v-card-actions class="pa-0 ml-3 mr-3">
      <v-chip :color="COLOR.ADMIN.MAIN" prepend-icon="mdi-content-save-plus-outline">
        어제 {{ dashboard.file.values.at(-2) || 0 }} 개 업로드됨
      </v-chip>
      <v-spacer></v-spacer>
      <v-chip :color="COLOR.ADMIN.MAIN" prepend-icon="mdi-content-save-all">
        총 {{ util.num(dashboard.file.total) }} 개 업로드됨
      </v-chip>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { COLOR } from "../../../../tsboard.config"
import { useAdminDashboardStore } from "../../../store/admin/dashboard/general"
import { useUtilStore } from "../../../store/util"

const dashboard = useAdminDashboardStore()
const util = useUtilStore()
</script>
