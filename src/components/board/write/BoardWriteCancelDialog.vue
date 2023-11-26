<template>
  <v-dialog v-model="board.confirmCancelDialog" persistent>
    <v-card width="500" class="mx-auto" :color="home.color">
      <v-card-title>확인</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="dialogBody">
        본문 작성란 내부에서 업로드하신 이미지들을 제외하고 나머지 입력 항목들은 모두 삭제됩니다.
        계속 진행하시겠습니까?
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-pencil" color="primary" @click="board.confirmCancelDialog = false"
          >아니요, 계속 작성하겠습니다</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="confirmCancel">삭제</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useBoardStore } from "../../../store/board"
import { useHomeStore } from "../../../store/home"

const board = useBoardStore()
const home = useHomeStore()
const emits = defineEmits<{
  cancel: []
}>()

// 글 작성 취소하기
function confirmCancel(): void {
  emits("cancel")
  board.confirmCancelDialog = false
}
</script>

<style scoped>
.dialogBody {
  background-color: white;
}
</style>
