<template>
  <v-dialog width="500" v-model="general.confirmRemoveBoardDialog" persistent>
    <v-card class="mx-auto">
      <v-card-title>중요! 게시판이 삭제됩니다!</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text mb-2">
        {{ general.removeBoardTarget.name }} 게시판을 정말로 삭제하시겠습니까? 해당 게시판에 기록된
        글과 사진들이 모두 완전히 삭제되며 이후 접근할 수 없습니다. 계속 진행하시겠습니까?
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-check" color="primary" @click="close"
          >이해했습니다, 삭제하지 않겠습니다</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="remove"
          >삭제
          <v-tooltip activator="parent">
            클릭하시면 {{ general.removeBoardTarget.name }} 게시판을 삭제하며 이후 되돌릴 수
            없습니다, 신중히 결정해 주세요!
          </v-tooltip>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useAdminGroupGeneralStore } from "../../../store/admin/group/general"

const general = useAdminGroupGeneralStore()

// 삭제하지 않고 그냥 닫기
function close(): void {
  general.removeBoardTarget.uid = 0
  general.removeBoardTarget.name = ""
  general.confirmRemoveBoardDialog = false
}

// 게시판 삭제하기
function remove(): void {
  general.removeBoard()
}
</script>

<style scoped>
.text {
  font-size: 1em;
  line-height: 1.8em;
}
</style>
