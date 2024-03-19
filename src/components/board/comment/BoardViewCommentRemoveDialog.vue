<template>
  <v-dialog v-model="comment.confirmRemoveCommentDialog" persistent>
    <v-card width="500" class="mx-auto" :color="home.color.header">
      <v-card-title>댓글을 삭제할까요?</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="mb-3">
        정말로 삭제하시겠습니까? 본문에 첨부하신 이미지는 에디터 내 이미지 관리하기 기능으로 삭제
        가능합니다. 계속 진행할까요?
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn prepend-icon="mdi-cancel" @click="comment.closeRemoveCommentDialog"
          >아니요, 그대로 두겠습니다</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="remove">삭제</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../store/board/gallery/viewer"
import { useCommentStore } from "../../../store/board/comment"
import { useHomeStore } from "../../../store/home"
import { BOARD_TYPE } from "../../../interface/board"

const viewer = useViewerStore()
const comment = useCommentStore()
const home = useHomeStore()

// 댓글 삭제하기
async function remove(): Promise<void> {
  if (viewer.config.type === BOARD_TYPE.BOARD) {
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
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
