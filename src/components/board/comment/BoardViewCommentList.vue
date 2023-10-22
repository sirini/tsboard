<template>
  <v-list>
    <v-list-item class="pa-0" v-for="(comment, index) in comments" :key="index">
      <v-toolbar density="compact" class="pl-3 mt-4 comment_menu">
        <user-nametag
          :name="comment.writer.name"
          :uid="comment.writer.uid"
          :profile="PREFIX + comment.writer.profile"
          size="default"
        ></user-nametag>
        <v-spacer></v-spacer>
        <v-chip prepend-icon="mdi-heart">
          {{ comment.like }}
          <v-tooltip activator="parent" location="top">이 댓글에 좋아요 누르기</v-tooltip>
        </v-chip>
        <v-btn icon
          ><v-icon size="small">mdi-reply</v-icon>
          <v-tooltip activator="parent" location="top">이 댓글에 답글 달기</v-tooltip>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
          <v-menu activator="parent" open-on-hover>
            <v-list density="compact">
              <v-list-item>
                <v-btn
                  prepend-icon="mdi-pencil"
                  variant="text"
                  :disabled="auth.user.uid !== comment.writer.uid && !auth.user.admin"
                  >이 댓글 수정하기</v-btn
                >
              </v-list-item>
              <v-list-item>
                <v-btn
                  prepend-icon="mdi-trash-can"
                  variant="text"
                  :disabled="auth.user.uid !== comment.writer.uid && !auth.user.admin"
                >
                  이 댓글 삭제하기
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </v-toolbar>
      <v-card elevation="0" rounded="0" class="pa-5 comment"> 여기는 댓글 내용입니다. </v-card>
    </v-list-item>
  </v-list>
  <board-view-comment-remove-dialog @remove="remove"></board-view-comment-remove-dialog>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../../store/auth"
import { useBoardStore } from "../../../store/board"
import { useUtilStore } from "../../../store/util"
import { Comment } from "../../../interface/board"
import UserNametag from "../../common/UserNametag.vue"
import BoardViewCommentRemoveDialog from "./BoardViewCommentRemoveDialog.vue"

const auth = useAuthStore()
const board = useBoardStore()
const util = useUtilStore()
const PREFIX = process.env.PREFIX || ""
const comments: Comment[] = [
  {
    uid: 15,
    postUid: 3,
    writer: {
      uid: 3,
      name: "홍길동",
      profile: "/no-profile.png",
    },
    content: "여기에 댓글 내용이 나옵니다",
    like: 5,
    reply: 2,
    date: "2023-10-22 17:48:11",
  },
]

// 댓글 삭제하기 처리
function remove(): void {
  // do something
  util.snack("댓글이 정상적으로 삭제(비공개) 되었습니다.")
}
</script>

<style scoped>
.comment_menu {
  border: 1px #dddddd solid;
}
.comment {
  line-height: 1.8em;
}
</style>
