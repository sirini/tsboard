<template>
  <v-dialog v-model="list.confirmRemoveGroupDialog" persistent>
    <v-card width="500" class="mx-auto">
      <v-card-title><v-icon>mdi-check</v-icon> 확인</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text mb-2">
        <p>
          <strong>{{ list.removeGroupTarget.name }}</strong> 그룹을 정말로 삭제하시겠습니까? 삭제된
          그룹 소속 게시판들은 모두 기본 그룹 소속으로 변경됩니다. 선택하신 그룹을 삭제를
          시작할까요?
        </p>
        <p class="mt-3">(안심하세요! 데이터는 그대로 유지됩니다.)</p>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-btn
          prepend-icon="mdi-close"
          rounded="xl"
          @click="list.closeRemoveGroupDialog"
          color="primary"
          >아니요, 삭제하지 않겠습니다 (권장)</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="list.removeGroup">삭제할께요 </v-btn>
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
    backdrop-filter: blur(5px);
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
