<template>
  <v-list density="compact">
    <v-list-subheader>게시판 바로가기</v-list-subheader>
    <v-divider></v-divider>
    <v-list-item
      v-for="(board, index) in boards"
      :key="index"
      append-icon="mdi-chevron-right"
      @click="util.go(board.type, board.id)"
    >
      {{ board.name }}
      <v-tooltip activator="parent">{{ board.info }}</v-tooltip>
    </v-list-item>
    <v-divider></v-divider>
  </v-list>
</template>

<script setup lang="ts">
import { useUtilStore } from "../../store/util"

const util = useUtilStore()
const boards = [
  { id: "test", type: "boardList", name: "실험용", info: "이 게시판은 실험용으로 만들었습니다" },
  { id: "freeboard", type: "boardList", name: "아무거나", info: "자유롭게 얘기 나누는 곳입니다" },
  { id: "notice", type: "boardList", name: "공지글", info: "공지사항입니다" },
  { id: "gallery", type: "galleryList", name: "갤러리", info: "갤러리 게시판입니다" },
  { id: "news", type: "boardList", name: "새소식", info: "새로운 소식들을 접할 수 있습니다" },
]
</script>
