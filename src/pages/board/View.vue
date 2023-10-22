<template>
  <v-app>
    <home-header></home-header>
    <v-layout>
      <v-main>
        <v-card :width="board.width" elevation="0" rounded="0" class="mx-auto board">
          <board-header></board-header>
          <v-list>
            <v-list-item>
              <v-list-item-title class="view_title">{{ post.subject }}</v-list-item-title>
            </v-list-item>
            <v-list-item class="view_info">
              <template v-slot:prepend>
                <span class="mr-4"
                  ><v-icon size="small" class="mr-2">mdi-filter-outline</v-icon>
                  {{ post.category.name }}</span
                >
                <v-divider vertical></v-divider>
                <span class="ml-4 mr-4"
                  ><v-icon size="small" class="mr-2">mdi-calendar</v-icon> {{ post.date }}</span
                >
              </template>
              <template v-slot:append>
                <span class="mr-4"
                  ><v-icon size="small" class="mr-2">mdi-eye-outline</v-icon> {{ post.view }}</span
                >
                <v-divider vertical></v-divider>
                <span class="ml-4 mr-4"
                  ><v-icon size="small" class="mr-2">mdi-heart-outline</v-icon>
                  {{ post.like }}</span
                >
                <v-divider vertical></v-divider>
                <span class="ml-4"
                  ><v-icon size="small" class="mr-2">mdi-comment-outline</v-icon>
                  {{ post.reply }}</span
                >
              </template>
            </v-list-item>
            <v-list-item class="view_content pa-5">
              {{ post.content }}
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
              <user-nametag
                :profile="post.writer.profile"
                :uid="post.writer.uid"
                :name="post.writer.name"
                size="default"
              ></user-nametag>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
                <v-menu activator="parent" open-on-hover>
                  <v-list density="compact">
                    <v-list-item>
                      <v-btn
                        prepend-icon="mdi-pencil"
                        variant="text"
                        :disabled="auth.user.uid !== post.writer.uid && !auth.user.admin"
                        >이 글 수정하기</v-btn
                      >
                    </v-list-item>
                    <v-list-item>
                      <v-btn
                        prepend-icon="mdi-trash-can"
                        variant="text"
                        :disabled="auth.user.uid !== post.writer.uid && !auth.user.admin"
                      >
                        이 글 삭제하기
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
            </v-toolbar>
          </v-list>
          <board-view-comment-write></board-view-comment-write>
          <board-view-comment-list></board-view-comment-list>

          <v-divider class="mt-3"></v-divider>
          <v-card-actions>
            <v-btn prepend-icon="mdi-view-list" @click="board.list(route.params?.id.toString())"
              >목록 보기</v-btn
            >
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
import { useAuthStore } from "../../store/auth"
import { useBoardStore } from "../../store/board"
import { Post } from "../../interface/board"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardViewCommentWrite from "../../components/board/comment/BoardViewCommentWrite.vue"
import BoardViewCommentList from "../../components/board/comment/BoardViewCommentList.vue"
import UserNametag from "../../components/common/UserNametag.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"

const route = useRoute()
const auth = useAuthStore()
const board = useBoardStore()
const post = ref<Post>({
  uid: 7,
  category: {
    uid: 6,
    name: "news",
  },
  writer: {
    uid: 11,
    name: "홍길동",
    profile: "/no-profile.png",
  },
  subject: "글 제목입니다",
  content: "글 내용입니다",
  like: 5,
  reply: 2,
  view: 120,
  date: "2023-10-22 17:37:50",
})
const PREFIX = process.env.PREFIX || ""
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
