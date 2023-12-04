<template>
  <v-dialog v-model="general.confirmRemoveCategoryDialog" persistent>
    <v-card width="500" class="mx-auto">
      <v-card-title>확인</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text mb-2">
        <strong>{{ route.params?.id }}</strong> 게시판의
        <strong>{{ general.board.category.remove.name }}</strong> 카테고리를 정말로
        삭제하시겠습니까? 해당하는 게시글들은 모두 기본 카테고리로 재설정되며 글은 삭제되지
        않습니다. 삭제를 시작할까요?
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-btn prepend-icon="mdi-close" rounded="xl" color="primary" @click="close"
          >아니요, 삭제하지 않겠습니다</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="remove"
          >삭제
          <v-tooltip activator="parent">글은 삭제되지 않으며 기본 카테고리로 변경됩니다.</v-tooltip>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useAdminBoardGeneralStore } from "../../../store/admin/board/general"

const route = useRoute()
const general = useAdminBoardGeneralStore()

// 아무것도 변경하지 않기
function close(): void {
  general.board.category.remove.uid = 0
  general.board.category.remove.name = ""
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
</style>
