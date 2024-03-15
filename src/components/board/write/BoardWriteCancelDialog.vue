<template>
  <v-dialog v-model="editor.confirmWriteCancelDialog" persistent>
    <v-card width="500" class="mx-auto" :color="home.color.header">
      <v-card-title>확인</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        본문 작성란 내부에서 이미 업로드하신 이미지들을 제외하고 나머지 입력 항목들은 모두
        초기화됩니다. 계속 진행하시겠습니까?
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-pencil" @click="editor.closeWriteCancelDialog"
          >아니요, 계속 작성하겠습니다</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="confirmCancel">작성 취소</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useBoardEditorStore } from "../../../store/board/editor"
import { useHomeStore } from "../../../store/home"

const editor = useBoardEditorStore()
const home = useHomeStore()
const emits = defineEmits<{
  cancel: []
}>()

// 글 작성 취소하기
function confirmCancel(): void {
  emits("cancel")
  editor.closeWriteCancelDialog()
}
</script>

<style scoped>
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
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>
