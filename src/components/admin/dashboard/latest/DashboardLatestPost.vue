<template>
  <v-card class="mt-3 mb-3" rounded="xl" :color="COLOR.ADMIN.MAIN">
    <v-card-title
      >최신 글
      <div class="more">
        <v-btn
          append-icon="mdi-chevron-right"
          rounded="xl"
          elevation="0"
          @click="util.go('adminLatestPost')"
          size="small"
          :color="COLOR.ADMIN.MAIN"
          >더 보기
          <v-tooltip activator="parent"
            >클릭하시면 최신 글들을 모아 둔 관리 화면으로 이동합니다.</v-tooltip
          >
        </v-btn>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-list density="compact">
      <v-list-item
        v-for="(post, index) in dashboard.posts"
        :key="index"
        @click="util.go(post.type, post.id, post.uid)"
        :prepend-avatar="
          TSBOARD.PREFIX +
          (post.writer.profile.length < 1 ? '/no-profile.svg' : post.writer.profile)
        "
      >
        <v-list-item-title>{{ post.content }}</v-list-item-title>
        <v-tooltip activator="parent">게시글을 확인하러 갑니다.</v-tooltip>
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
