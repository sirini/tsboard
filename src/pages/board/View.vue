<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <v-card elevation="0" rounded="0" class="mx-auto board" max-width="1000">
            <board-header></board-header>
            <v-list>
              <v-list-item>
                <v-list-item-title class="view_title">{{ post.title }}</v-list-item-title>
              </v-list-item>
              <v-list-item class="view_info">
                <template v-slot:prepend>
                  <span class="mr-4"
                    ><v-icon size="small" class="mr-2">mdi-filter-outline</v-icon>
                    {{ post.category.name }}</span
                  >
                  <v-divider vertical></v-divider>
                  <span class="ml-4 mr-4"
                    ><v-icon size="small" class="mr-2">mdi-calendar</v-icon>
                    {{ post.submitted }}</span
                  >
                </template>
                <template v-slot:append>
                  <span class="mr-4"
                    ><v-icon size="small" class="mr-2">mdi-eye-outline</v-icon> {{ post.hit }}</span
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
              <v-toolbar density="compact" class="view_menu" :color="home.color.header">
                <v-chip
                  class="ml-3"
                  :disabled="auth.user.uid < 1"
                  prepend-icon="mdi-heart"
                  :color="post.liked ? 'red' : 'surface-variant'"
                  @click=""
                >
                  {{ post.like }}
                  <v-tooltip activator="parent" location="top">이 글에 좋아요 누르기</v-tooltip>
                </v-chip>
                <v-spacer></v-spacer>
                <user-nametag
                  :profile="PREFIX + post.writer.profile"
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
              <v-btn prepend-icon="mdi-view-list" @click="util.go('boardList', list.id)"
                >목록 보기</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                prepend-icon="mdi-pencil"
                variant="text"
                @click="util.go('boardWrite', list.id)"
                >새글쓰기</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
    <user-info-dialog></user-info-dialog>
    <send-note-dialog></send-note-dialog>
    <send-report-dialog></send-report-dialog>
    <manage-user-dialog></manage-user-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "../../store/auth"
import { useBoardListStore } from "../../store/board/list"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import { Post } from "../../interface/board"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardViewCommentWrite from "../../components/board/comment/BoardViewCommentWrite.vue"
import BoardViewCommentList from "../../components/board/comment/BoardViewCommentList.vue"
import UserNametag from "../../components/user/UserNametag.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import SendNoteDialog from "../../components/user/SendNoteDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import SideDrawer from "../home/SideDrawer.vue"

const auth = useAuthStore()
const list = useBoardListStore()
const util = useUtilStore()
const home = useHomeStore()
const post = ref<Post>({
  uid: 7,
  category: {
    uid: 6,
    name: "news",
  },
  writer: {
    uid: 11,
    name: "홍길동",
    profile: "/no-profile.svg",
  },
  title: "글 제목입니다",
  content: "글 내용입니다",
  like: 5,
  reply: 2,
  hit: 120,
  submitted: 0,
  modified: 0,
  liked: false,
  status: 0,
})
const PREFIX = process.env.PREFIX || ""
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.board {
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
