<template>
  <v-card class="mt-3 mb-3" rounded="xl" :color="COLOR.ADMIN.MAIN">
    <v-card-title
      >최신 댓글
      <div class="more">
        <v-btn
          append-icon="mdi-chevron-right"
          rounded="xl"
          elevation="0"
          @click="util.go('adminLatestComment')"
          size="small"
          :color="COLOR.ADMIN.MAIN"
          >더 보기</v-btn
        >
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-list density="compact">
      <v-list-item
        v-for="(comment, index) in dashboard.comments"
        :key="index"
        @click="util.go(comment.type, comment.id, comment.uid)"
        :prepend-avatar="
          TSBOARD.PREFIX +
          (comment.writer.profile.length < 1 ? '/no-profile.svg' : comment.writer.profile)
        "
      >
        <v-list-item-title>{{ comment.content.slice(0, 100) }}</v-list-item-title>
        <v-tooltip activator="parent">댓글을 확인하러 갑니다.</v-tooltip>
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
