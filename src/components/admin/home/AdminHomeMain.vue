<template>
  <v-card elevation="0">
    <v-list>
      <v-list-subheader>간단 통계 (방문자수 / 회원 수 / 게시글 수)</v-list-subheader>
      <v-list-item>
        <admin-home-main-simple-stat></admin-home-main-simple-stat>
      </v-list-item>
      <v-list-subheader>최근 활동 (최신글 / 최신 댓글 / 최근 신고)</v-list-subheader>
      <v-list-item> // TODO </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useAdminHomeMainStore } from "../../../store/admin/home/main"
import AdminHomeMainSimpleStat from "./AdminHomeMainSimpleStat.vue"

const main = useAdminHomeMainStore()
</script>
