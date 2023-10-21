<template>
  <v-app>
    <home-header></home-header>
    <v-layout>
      <v-main>
        <v-card :width="board.width" elevation="0" rounded="0" class="mx-auto board">
          <board-header></board-header>
          <v-list>
            <v-list-item>
              <v-list-item-title class="view_title">제목입니다.</v-list-item-title>
            </v-list-item>
            <v-list-item class="view_info">
              <template v-slot:prepend>
                <span class="mr-4"
                  ><v-icon size="small" class="mr-2">mdi-filter-outline</v-icon> news</span
                >
                <v-divider vertical></v-divider>
                <span class="ml-4 mr-4"
                  ><v-icon size="small" class="mr-2">mdi-calendar</v-icon> 2023.09.29 12:23:34</span
                >
              </template>
              <template v-slot:append>
                <span class="mr-4"
                  ><v-icon size="small" class="mr-2">mdi-eye-outline</v-icon> 5678</span
                >
                <v-divider vertical></v-divider>
                <span class="ml-4 mr-4"
                  ><v-icon size="small" class="mr-2">mdi-heart-outline</v-icon> 5</span
                >
                <v-divider vertical></v-divider>
                <span class="ml-4"
                  ><v-icon size="small" class="mr-2">mdi-comment-outline</v-icon> 16</span
                >
              </template>
            </v-list-item>
            <v-list-item class="view_content pa-5">
              <p>이 글은 게시판 테스트 글입니다.</p>
              <p>이 글은 게시판 테스트 글입니다.</p>
              <p>이 글은 게시판 테스트 글입니다.</p>
            </v-list-item>
            <v-toolbar density="compact" class="view_menu">
              <v-btn icon
                ><v-icon>mdi-heart</v-icon>
                <v-tooltip activator="parent" location="top"
                  >이 글에 좋아요 누르기</v-tooltip
                ></v-btn
              >
              <v-btn icon
                ><v-icon>mdi-bookmark</v-icon>
                <v-tooltip activator="parent" location="top"
                  >이 글을 내 북마크에 저장하기</v-tooltip
                ></v-btn
              >
              <v-btn icon
                ><v-icon>mdi-share</v-icon>
                <v-tooltip activator="parent" location="top">이 글을 공유하기</v-tooltip></v-btn
              >
              <v-spacer></v-spacer>
              <board-user-nametag></board-user-nametag>
              <v-btn icon
                ><v-icon>mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top"
                  >이 글을 수정하기 (작성자/관리자만 가능)</v-tooltip
                ></v-btn
              >
              <v-btn icon
                ><v-icon>mdi-trash-can</v-icon
                ><v-tooltip activator="parent" location="top"
                  >이 글을 삭제하기 (작성자/관리자만 가능)</v-tooltip
                ></v-btn
              >
            </v-toolbar>
          </v-list>
          <board-view-comment-write></board-view-comment-write>
          <board-view-comment-list></board-view-comment-list>

          <v-divider class="mt-3"></v-divider>
          <v-card-actions>
            <v-btn prepend-icon="mdi-view-list" @click="board.list(id)">목록 보기</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              prepend-icon="mdi-pencil"
              variant="text"
              @click="board.write(route.params?.id.toString())"
              >새글쓰기</v-btn
            >
          </v-card-actions>
        </v-card>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useBoardStore } from "../../store/board"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardViewCommentWrite from "../../components/board/comment/BoardViewCommentWrite.vue"
import BoardViewCommentList from "../../components/board/comment/BoardViewCommentList.vue"
import BoardUserNametag from "../../components/board/common/BoardUserNametag.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"

const route = useRoute()
const board = useBoardStore()
const id = ref<string>(route.params?.id.toString())
</script>

<style scoped>
.board {
  margin-top: 80px;
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
    border-left: 1px #dddddd solid;
    border-right: 1px #dddddd solid;
    border-bottom: 1px #dddddd solid;
  }
}
</style>
