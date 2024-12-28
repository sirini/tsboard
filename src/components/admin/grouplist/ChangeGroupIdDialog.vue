<template>
  <v-dialog v-model="list.changeGroupIdDialog" persistent>
    <v-card :max-width="home.dialogWidth" class="mx-auto" :color="COLOR.ADMIN.MAIN">
      <v-card-title>그룹ID 변경하기</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-text-field
          v-model="list.changeGroupId"
          hide-details
          bg-color="white"
          width="200"
          variant="solo"
          rounded="pill"
          prepend-inner-icon="mdi-identifier"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn prepend-icon="mdi-close" rounded="pill" @click="list.closeChangeGroupIdDialog"
          >닫기</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-content-save" rounded="pill" @click="list.updateGroupId"
          >변경하기</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { COLOR } from "../../../../tsboard.config"
import { useAdminGroupListStore } from "../../../store/admin/group/list"
import { useHomeStore } from "../../../store/home"

const list = useAdminGroupListStore()
const home = useHomeStore()
</script>
