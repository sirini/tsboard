<template>
  <v-dialog v-model="write.confirmWriteCancelDialog" persistent>
    <v-card width="500" class="mx-auto" :color="home.color.header">
      <v-card-title>확인</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="dialogBody">
        본문 작성란 내부에서 업로드하신 이미지들을 제외하고 나머지 입력 항목들은 모두 삭제됩니다.
        계속 진행하시겠습니까?
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn prepend-icon="mdi-pencil" color="primary" @click="write.closeWriteCancelDialog"
          >아니요, 계속 작성하겠습니다</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="confirmCancel"
          >삭제
          <v-tooltip activator="parent"
            >작성중인 내용을 잃게 됩니다! 내용은 다시 복구되지 않습니다.</v-tooltip
          >
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useWriteStore } from "../../../store/write"
import { useHomeStore } from "../../../store/home"

const write = useWriteStore()
const home = useHomeStore()
const emits = defineEmits<{
  cancel: []
}>()

// 글 작성 취소하기
function confirmCancel(): void {
  emits("cancel")
  write.closeWriteCancelDialog()
}
</script>

<style scoped>
.dialogBody {
  background-color: white;
}
</style>
