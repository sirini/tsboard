<template>
  <v-dialog v-model="editor.confirmWriteCancelDialog" persistent>
    <v-card :max-width="home.dialogWidth" class="mx-auto" :color="COLOR.HOME.MAIN" rounded="xl">
      <v-card-title>{{ TEXT[home.lang].TITLE_CONFIRM }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        {{ TEXT[home.lang].CHECK_BEFORE_REMOVE }}
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-pencil" @click="editor.closeWriteCancelDialog" rounded="pill">{{
          TEXT[home.lang].CANCEL_REMOVE
        }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="confirmCancel" rounded="pill">{{
          TEXT[home.lang].CONFIRM_REMOVE
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useBoardEditorStore } from "../../../store/board/editor"
import { useHomeStore } from "../../../store/home"
import { TEXT } from "../../../messages/components/board/write/board-write-editor-others"
import { COLOR } from "../../../../tsboard.config"

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
    backdrop-filter: blur(2px);
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>
