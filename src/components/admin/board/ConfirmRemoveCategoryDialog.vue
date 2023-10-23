<template>
  <v-dialog width="500" v-model="admin.confirmRemoveCategoryDialog" persistent>
    <v-card class="mx-auto">
      <v-card-title>확인</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text mb-2">
        <strong>{{ route.params?.id }}</strong> 게시판의
        <strong>{{ admin.board.category.remove.name }}</strong> 카테고리를 정말로 삭제하시겠습니까?
        해당하는 게시글들은 모두 기본 카테고리로 재설정되며 글은 삭제되지 않습니다. 계속
        진행하시겠습니까?
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-check" color="primary" @click="close"
          >이해했습니다, 그대로 유지할께요</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="remove">삭제</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useAdminStore } from "../../../store/admin"

const route = useRoute()
const admin = useAdminStore()

// 아무것도 변경하지 않기
function close(): void {
  admin.board.category.remove.uid = 0
  admin.board.category.remove.name = ""
  admin.confirmRemoveCategoryDialog = false
}

// 카테고리 삭제하기
async function remove(): Promise<void> {
  await admin.removeCategory()
  admin.confirmRemoveCategoryDialog = false
}
</script>

<style scoped>
.text {
  font-size: 1em;
  line-height: 1.8em;
}
</style>
