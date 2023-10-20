<template>
  <v-dialog width="500" v-model="board.confirmCancelDialog">
    <v-card>
      <v-card-title>정말 작성을 취소하시나요?</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="mb-3">
        업로드 하신 이미지 파일들을 제외한 모든 내용이 삭제 되며, 이 작업은 되돌릴 수 없습니다. 계속
        진행하시겠습니까? (이미 업로드하신 이미지들은 ⌜기존 이미지 추가/관리⌟ 기능에서 삭제
        가능합니다.)
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-pencil" color="primary" @click="board.confirmCancelDialog = false"
          >아니요, 계속 작성하겠습니다</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-check-bold" @click="confirmCancel">예</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useBoardStore } from "../../store/board"

const board = useBoardStore()
const emit = defineEmits(["cancel"])

// 글 작성 취소하기
function confirmCancel(): void {
  emit("cancel")
  board.confirmCancelDialog = false
}
</script>
