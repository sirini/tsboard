<template>
  <v-card elevation="0">
    <v-list>
      <v-list-item class="mb-2"> {{ general.group.id }} 소속 게시판 목록 </v-list-item>
      <v-divider></v-divider>
      <v-list-item v-for="(board, index) in boards" :key="index" class="mt-2 mb-2">
        <template v-slot:prepend>
          <v-text-field
            v-model="board.id"
            variant="outlined"
            density="compact"
            width="100"
            hide-details
            prepend-inner-icon="mdi-pencil-off"
          ></v-text-field>
        </template>
        <v-list-item-title>
          <v-text-field
            v-model="board.info"
            variant="outlined"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-information"
          ></v-text-field>
        </v-list-item-title>
        <template v-slot:append>
          <v-text-field
            v-model="board.admin"
            variant="outlined"
            density="compact"
            width="100"
            hide-details
            prepend-inner-icon="mdi-account-tie-hat"
          ></v-text-field>
          <v-btn prepend-icon="mdi-pencil">수정</v-btn>
          <v-btn prepend-icon="mdi-trash-can">삭제</v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useAdminGroupGeneralStore } from "../../../store/admin/group/general"

const general = useAdminGroupGeneralStore()
const boards = [
  { uid: 1, id: "test", info: "테스트용 게시판 입니다.", admin: "master01" },
  { uid: 2, id: "test2", info: "테스트용 게시판 2 입니다.", admin: "master02" },
  { uid: 3, id: "free", info: "자유롭게 얘기 나눌 수 있는 게시판입니다.", admin: "master03" },
]
</script>
