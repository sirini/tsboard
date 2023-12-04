<template>
  <v-dialog v-model="general.confirmRemoveBoardDialog" persistent>
    <v-card width="500" class="mx-auto">
      <v-card-title><v-icon color="error">mdi-alert</v-icon> 주의가 필요합니다</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text">
        {{ general.removeBoardTarget.name }} 게시판을 정말로 삭제하시겠습니까? 해당 게시판에 기록된
        글과 사진들이 모두 완전히 삭제되며 이후 접근할 수 없습니다. 삭제를 시작할까요?
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-btn
          prepend-icon="mdi-close"
          rounded="xl"
          color="primary"
          @click="general.closeRemoveBoardDialog"
          >아니요, 삭제하지 않겠습니다</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="general.removeBoard"
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
</script>

<style scoped>
.text {
  font-size: 1em;
  line-height: 1.8em;
}

.red {
  color: red;
}
</style>
