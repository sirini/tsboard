<template>
  <v-row no-gutters>
    <v-col class="pa-1">
      <v-card class="mt-3 mb-3">
        <v-card-title class="title"
          >최신 글
          <div class="more">
            <v-btn
              append-icon="mdi-chevron-right"
              rounded="xl"
              elevation="0"
              @click="util.go('adminLatestPost')"
              size="small"
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
    </v-col>

    <v-col class="pa-1">
      <v-card class="mt-3 mb-3">
        <v-card-title class="title"
          >최신 댓글
          <div class="more">
            <v-btn
              append-icon="mdi-chevron-right"
              rounded="xl"
              elevation="0"
              @click="util.go('adminLatestComment')"
              size="small"
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
            <v-list-item-title v-html="comment.content"></v-list-item-title>
            <v-tooltip activator="parent">댓글을 확인하러 갑니다.</v-tooltip>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col class="pa-1">
      <v-card class="mt-3 mb-3">
        <v-card-title class="title"
          >최근 신고
          <div class="more">
            <v-btn
              append-icon="mdi-chevron-right"
              rounded="xl"
              elevation="0"
              @click="util.go('adminReport')"
              size="small"
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
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { TSBOARD } from "../../../../tsboard.config"
import { useAdminDashboardStore } from "../../../store/admin/dashboard/general"
import { useUtilStore } from "../../../store/util"

const dashboard = useAdminDashboardStore()
const util = useUtilStore()
</script>

<style scoped>
.more {
  position: absolute;
  top: 8px;
  right: 5px;
}

.title {
  border-top: #607d8b 2px solid;
}
</style>
