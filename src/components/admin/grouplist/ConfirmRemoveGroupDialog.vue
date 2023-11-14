<template>
  <v-dialog width="500" v-model="list.confirmRemoveGroupDialog" persistent>
    <v-card class="mx-auto">
      <v-card-title>확인</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text mb-2">
        <strong>{{ list.removeGroupTarget.name }}</strong> 그룹을 정말로 삭제하시겠습니까? 삭제된
        그룹 소속 게시판들은 모두 기본 그룹 소속으로 변경됩니다. 삭제를 시작할까요?
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-btn prepend-icon="mdi-close" rounded="xl" color="info" variant="tonal" @click="close"
          >아니요, 삭제하지 않겠습니다</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="remove">삭제</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useAdminGroupListStore } from "../../../store/admin/group/list"

const route = useRoute()
const list = useAdminGroupListStore()

// 아무것도 변경하지 않기
function close(): void {
  list.removeGroupTarget.uid = 0
  list.removeGroupTarget.name = ""
  list.confirmRemoveGroupDialog = false
}

// 그룹 삭제하기
async function remove(): Promise<void> {
  await list.removeGroup()
  close()
}
</script>

<style scoped>
.text {
  font-size: 1em;
  line-height: 1.8em;
}
</style>
