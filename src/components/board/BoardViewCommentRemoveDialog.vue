<template>
  <v-dialog width="500" v-model="board.confirmRemoveCommentDialog" persistent>
    <v-card>
      <v-card-title>댓글을 삭제할까요?</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="mb-3">
        업로드 하신 이미지 파일들을 포함한 모든 내용이 삭제 되며, 이 작업은 되돌릴 수 없습니다. 만약
        답글이 달려있을 경우 내용만 비공개로 전환되며 댓글 자체는 삭제되지 않습니다. 계속
        진행하시겠습니까?
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          prepend-icon="mdi-check-bold"
          color="primary"
          @click="board.confirmRemoveCommentDialog = false"
          >아니요, 그대로 두겠습니다</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="confirmRemove">예, 삭제할께요</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useBoardStore } from "../../store/board"

const board = useBoardStore()
const emit = defineEmits(["remove"])

// 글 작성 취소하기
function confirmRemove(): void {
  emit("remove")
  board.confirmRemoveCommentDialog = false
}
</script>
