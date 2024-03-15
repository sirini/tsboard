<template>
  <v-dialog v-model="view.confirmRemovePostDialog" persistent>
    <v-card width="500" class="mx-auto" color="red">
      <v-card-title><v-icon>mdi-alert</v-icon> 정말로 삭제하시겠습니까?</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        작성하신 본문과 첨부한 파일들이 모두 삭제되며, 다른 사용자가 남겨주신 댓글들도 볼 수 없게
        됩니다. 계속 진행하시겠습니까?
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-cancel" @click="view.closeConfirmRemoveDialog"
          >아니요, 그대로 두겠습니다.</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="view.removePost">삭제</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useBoardViewStore } from "../../../store/board/view"
import { useHomeStore } from "../../../store/home"

const view = useBoardViewStore()
const home = useHomeStore()
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
