<template>
  <v-dialog v-model="comment.confirmRemoveCommentDialog" persistent>
    <v-card width="500" class="mx-auto">
      <v-card-title>댓글을 삭제할까요?</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="mb-3">
        만약 답글이 달려있을 경우 내용만 비공개로 전환되며 댓글 자체는 삭제되지 않습니다. 계속
        진행하시겠습니까? (본문에 첨부하신 이미지는 기존 이미지 추가/관리 메뉴를 통해 개별적으로
        삭제 가능)
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          prepend-icon="mdi-check-bold"
          color="primary"
          @click="comment.closeRemoveCommentDialog"
          >아니요, 그대로 두겠습니다</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="comment.removeComment">예, 삭제할께요</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useCommentStore } from "../../../store/board/comment"

const comment = useCommentStore()
</script>
