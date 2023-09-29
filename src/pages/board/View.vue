<template>
  <v-container>
    <v-card elevation="0" rounded="0">
      <board-header></board-header>
      <v-list>
        <v-list-item>
          <v-list-item-title class="view_title">제목입니다.</v-list-item-title>
        </v-list-item>
        <v-list-item class="view_info">
          <template v-slot:prepend>
            <span class="mr-4"
              ><v-icon size="small" class="mr-2">mdi-calendar</v-icon> 2023.09.29 12:23:34</span
            >
          </template>
          <template v-slot:append>
            <span class="mr-4"><v-icon size="small" class="mr-2">mdi-eye</v-icon> 5678</span>
            <v-divider vertical></v-divider>
            <span class="ml-4 mr-4"><v-icon size="small" class="mr-2">mdi-heart</v-icon> 5</span>
            <v-divider vertical></v-divider>
            <span class="ml-4"><v-icon size="small" class="mr-2">mdi-comment</v-icon> 16</span>
          </template>
        </v-list-item>
        <v-list-item class="view_content pa-5">
          <p>이 글은 게시판 테스트 글입니다.</p>
          <p>이 글은 게시판 테스트 글입니다.</p>
          <p>이 글은 게시판 테스트 글입니다.</p>
        </v-list-item>
        <v-toolbar density="compact" class="view_menu">
          <v-btn icon><v-icon>mdi-heart</v-icon></v-btn>
          <v-btn icon><v-icon>mdi-bookmark</v-icon></v-btn>
          <v-btn icon><v-icon>mdi-share</v-icon></v-btn>
          <v-spacer></v-spacer>
          <board-user-nametag></board-user-nametag>
          <v-btn icon><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn icon><v-icon>mdi-trash-can</v-icon></v-btn>
        </v-toolbar>
      </v-list>
      <board-view-comment-write></board-view-comment-write>
      <board-view-comment-list></board-view-comment-list>

      <v-divider class="mt-3"></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-view-list" @click="board.goListPage(id)">목록 보기</v-btn>
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-pencil" @click="board.goWritePage(id)">새글 작성</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useBoardStore } from "../../store/board"
import BoardHeader from "../../components/board/BoardHeader.vue"
import BoardViewCommentWrite from "../../components/board/BoardViewCommentWrite.vue"
import BoardViewCommentList from "../../components/board/BoardViewCommentList.vue"
import BoardUserNametag from "../../components/board/BoardUserNametag.vue"

const route = useRoute()
const id = ref<string>(route.params?.id.toString())
const board = useBoardStore()
</script>

<style scoped>
.view_title {
  font-weight: bold;
}
.view_info {
  border-bottom: 1px #dddddd solid;
  color: #828282;
  font-size: 0.85em;
}
.view_content {
  border-left: 1px #eeeeee solid;
  border-right: 1px #eeeeee solid;
  line-height: 1.8em;
}
.view_menu {
  border: 1px #dddddd solid;
}
</style>
