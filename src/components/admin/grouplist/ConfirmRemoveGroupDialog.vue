<template>
  <v-dialog v-model="list.confirmRemoveGroupDialog" persistent>
    <v-card width="500" class="mx-auto">
      <v-card-title>확인</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text mb-2">
        <strong>{{ list.removeGroupTarget.name }}</strong> 그룹을 정말로 삭제하시겠습니까? 삭제된
        그룹 소속 게시판들은 모두 기본 그룹 소속으로 변경됩니다. 삭제를 시작할까요?
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-btn
          prepend-icon="mdi-close"
          rounded="xl"
          @click="list.closeRemoveGroupDialog"
          color="primary"
          >아니요, 삭제하지 않겠습니다</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="list.removeGroup"
          >삭제
          <v-tooltip activator="parent"
            >게시판들은 삭제되지 않으며, 기본 그룹 소속으로만 변경됩니다.</v-tooltip
          >
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useAdminGroupListStore } from "../../../store/admin/group/list"

const list = useAdminGroupListStore()
</script>

<style scoped>
.text {
  font-size: 1em;
  line-height: 1.8em;
}
</style>
