<template>
  <v-card elevation="0">
    <v-list>
      <v-list-item class="mb-2"> {{ general.group.name }} 소속 게시판 목록 </v-list-item>
      <v-divider></v-divider>
      <v-list-item v-for="(board, index) in general.boards" :key="index" class="mt-2 mb-2">
        <v-row no-gutters>
          <v-col cols="2">
            <v-text-field
              v-model="board.id"
              variant="outlined"
              density="compact"
              width="100"
              hide-details
              readonly
              class="mr-3"
              prepend-inner-icon="mdi-identifier"
            ></v-text-field
          ></v-col>
          <v-col cols="5">
            <v-text-field
              v-model="board.info"
              variant="outlined"
              density="compact"
              hide-details
              readonly
              class="mr-3"
              prepend-inner-icon="mdi-information"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="board.admin"
              variant="outlined"
              density="compact"
              width="100"
              hide-details
              readonly
              class="mr-3"
              prepend-inner-icon="mdi-account-tie-hat"
            ></v-text-field>
          </v-col>
          <v-col class="text-right">
            <v-btn icon @click="util.go('boardList', board.id)" elevation="0"
              ><v-icon>mdi-link-variant</v-icon></v-btn
            >
            <v-btn prepend-icon="mdi-pencil" variant="text">수정</v-btn>
            <v-btn prepend-icon="mdi-trash-can" variant="text">삭제</v-btn>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useAdminGroupGeneralStore } from "../../../store/admin/group/general"
import { useUtilStore } from "../../../store/util"

const general = useAdminGroupGeneralStore()
const util = useUtilStore()
</script>
