<template>
  <v-dialog v-model="general.confirmRemoveBoardDialog" persistent>
    <v-card :max-width="home.dialogWidth" class="mx-auto" color="error">
      <v-card-title><v-icon>mdi-alert</v-icon> 주의가 필요합니다 !</v-card-title>
      <v-divider></v-divider>

      <v-card-text class="text mb-3">
        <strong>{{ general.removeBoardTarget.name }}</strong> 게시판을 정말로 삭제하시겠습니까? 해당
        게시판에 기록된 게시글과 댓글, 사진을 포함한 첨부파일들이 모두 완전히 삭제되며 이후 접근할
        수 없습니다. 작업을 시작하면 되돌릴 수 없습니다. 계속 진행할까요?
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          prepend-icon="mdi-close"
          rounded="pill"
          color="yellow"
          @click="general.closeRemoveBoardDialog"
          >아니요, 삭제하지 않겠습니다 (권장)</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" rounded="pill" @click="general.removeBoard">삭제</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useAdminGroupGeneralStore } from "../../../store/admin/group/general"
import { useHomeStore } from "../../../store/home"

const general = useAdminGroupGeneralStore()
const home = useHomeStore()
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
