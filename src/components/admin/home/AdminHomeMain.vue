<template>
  <v-card elevation="0">
    <v-list>
      <v-list-subheader>간단 통계 (방문자수 / 회원 수 / 게시글 수)</v-list-subheader>
      <v-list-item>
        <admin-home-main-simple-stat></admin-home-main-simple-stat>
      </v-list-item>
      <v-list-subheader>최근 활동 (최신글 / 최신 댓글 / 최근 신고)</v-list-subheader>
      <v-list-item>
        <admin-home-main-latest-update></admin-home-main-latest-update>
      </v-list-item>
      <v-list-subheader>관리 링크 (그룹 / 게시판 / 회원)</v-list-subheader>
      <v-list-item>
        <admin-home-main-manage-link></admin-home-main-manage-link>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useAdminHomeMainStore } from "../../../store/admin/home/main"
import AdminHomeMainSimpleStat from "./AdminHomeMainSimpleStat.vue"
import AdminHomeMainLatestUpdate from "./AdminHomeMainLatestUpdate.vue"
import AdminHomeMainManageLink from "./AdminHomeMainManageLink.vue"

const main = useAdminHomeMainStore()
</script>
