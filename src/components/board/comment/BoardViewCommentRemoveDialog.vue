<template>
  <v-dialog v-model="comment.confirmRemoveCommentDialog" persistent>
    <v-card :max-width="home.dialogWidth" class="mx-auto" :color="COLOR.HOME.HEADER">
      <v-card-title>{{ TEXT[home.lang].TITLE }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="mb-3">
        {{ TEXT[home.lang].WARNING }}
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn prepend-icon="mdi-cancel" @click="comment.closeRemoveCommentDialog">{{
          TEXT[home.lang].NO
        }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="remove">{{ TEXT[home.lang].YES }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../store/board/gallery.viewer"
import { useCommentStore } from "../../../store/board/comment"
import { useHomeStore } from "../../../store/home"
import { TEXT } from "../../../messages/components/board/comment/board-view-comment-remove-dialog"
import { BOARD } from "../../../interface/board_interface"
import { COLOR } from "../../../../tsboard.config"

const viewer = useViewerStore()
const comment = useCommentStore()
const home = useHomeStore()

// 댓글 삭제하기
async function remove(): Promise<void> {
  if (viewer.config.type === BOARD.DEFAULT) {
    comment.removeComment()
  } else {
    await comment.removeComment()
    await viewer.loadComments()
  }
}
</script>

<style scoped>
.text {
  font-size: 1em;
  line-height: 1.8em;
}

/** 다이얼로그 배경 조정 */
.v-overlay--active {
  animation: tsboardCustomOverlay 0.5s ease-in forwards;
}
@keyframes tsboardCustomOverlay {
  from {
    backdrop-filter: blur(0px);
    background: rgba(0, 0, 0, 0);
  }
  to {
    backdrop-filter: blur(2px);
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>
