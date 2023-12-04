<template>
  <v-list>
    <v-list-item class="pa-0" v-for="(co, index) in comment.comments" :key="index">
      <v-toolbar density="compact" class="pl-3 mt-4 comment_menu" :color="home.color">
        <user-nametag
          :name="co.writer.name"
          :uid="co.writer.uid"
          :profile="PREFIX + co.writer.profile"
          size="default"
        ></user-nametag>
        <v-spacer></v-spacer>
        <v-chip :disabled="auth.user.uid < 1" prepend-icon="mdi-heart">
          {{ co.like }}
          <v-tooltip activator="parent" location="top">이 댓글에 좋아요 누르기</v-tooltip>
        </v-chip>
        <v-btn
          :disabled="auth.user.uid < 1"
          icon
          @click="comment.setReplyComment(co.uid, co.content)"
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
                  :disabled="auth.user.uid !== co.writer.uid && !auth.user.admin"
                  @click="comment.setModifyComment(co.uid, co.content)"
                  >이 댓글 수정하기</v-btn
                >
              </v-list-item>
              <v-list-item>
                <v-btn
                  prepend-icon="mdi-trash-can"
                  variant="text"
                  :disabled="auth.user.uid !== co.writer.uid && !auth.user.admin"
                  @click="comment.openRemoveCommentDialog(co.uid)"
                >
                  이 댓글 삭제하기
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </v-toolbar>

      <v-card elevation="0" rounded="0" class="pa-5 comment tiptap" v-html="co.content"></v-card>
    </v-list-item>
  </v-list>
  <board-view-comment-remove-dialog></board-view-comment-remove-dialog>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../../store/auth"
import { useCommentStore } from "../../../store/comment"
import { useHomeStore } from "../../../store/home"
import UserNametag from "../../user/UserNametag.vue"
import BoardViewCommentRemoveDialog from "./BoardViewCommentRemoveDialog.vue"

const auth = useAuthStore()
const comment = useCommentStore()
const home = useHomeStore()
const PREFIX = process.env.PREFIX || ""
</script>

<style scoped>
.comment_menu {
  border: 1px #dddddd solid;
}
.comment {
  line-height: 1.8em;
  min-height: 70px;
}
</style>
