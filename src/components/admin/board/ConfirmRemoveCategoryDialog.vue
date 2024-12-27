<template>
  <v-dialog v-model="general.confirmRemoveCategoryDialog" persistent>
    <v-card :max-width="home.dialogWidth" class="mx-auto" :color="COLOR.HOME.HEADER">
      <v-card-title>카테고리를 삭제할까요?</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text mb-3">
        <strong>{{ route.params?.id }}</strong> 게시판의
        <strong>{{ general.boardRemoveCategory.name }}</strong> 카테고리를 정말로 삭제하시겠습니까?
        해당하는 게시글들은 모두 기본 카테고리로 재설정되며 글은 삭제되지 않습니다. 계속 진행할까요?
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn prepend-icon="mdi-close" rounded="xl" @click="close"
          >아니요, 삭제하지 않겠습니다</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="remove">삭제할께요</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useHomeStore } from "../../../store/home"
import { useAdminBoardGeneralStore } from "../../../store/admin/board/general"

const route = useRoute()
const home = useHomeStore()
const general = useAdminBoardGeneralStore()

// 아무것도 변경하지 않기
function close(): void {
  general.boardRemoveCategory.uid = 0
  general.boardRemoveCategory.name = ""
  general.confirmRemoveCategoryDialog = false
}

// 카테고리 삭제하기
async function remove(): Promise<void> {
  await general.removeCategory()
  general.confirmRemoveCategoryDialog = false
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
