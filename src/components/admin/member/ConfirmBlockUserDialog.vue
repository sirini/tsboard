<template>
  <v-dialog v-model="general.confirmBlockUserDialog" persistent>
    <v-card width="500" class="mx-auto">
      <v-card-title>{{ general.blockUserTarget.name }} 님이 신고 받은 내역</v-card-title>
      <v-divider></v-divider>
      <v-list density="compact">
        <v-list-item v-for="(report, index) in general.reports" :key="index" class="item">
          <template v-slot:prepend>
            <v-chip color="blue-grey" class="mr-3">@{{ report.from.name }}</v-chip>
          </template>
          {{ report.content }} <span class="date pl-2">{{ report.date }}</span>
        </v-list-item>
      </v-list>
      
      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="general.closeBlockUserDialog">닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" color="red" @click="general.blockUser"
          >차단하기
          <v-tooltip activator="parent"
            >차단된 사용자는 로그인을 할 수 없으며, 비회원과 동일해집니다.</v-tooltip
          >
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useAdminMemberGeneralStore } from "../../../store/admin/member/general"

const general = useAdminMemberGeneralStore()
</script>

<style scoped>
.item {
  border-bottom: #eceff1 1px solid;
}
.date {
  font-size: 0.8em;
  color: #90a4ae;
}
</style>
