<template>
  <v-list density="compact">
    <v-list-subheader>내 정보</v-list-subheader>
    <v-divider></v-divider>
    <v-list-item append-icon="mdi-chevron-right" @click="util.go('myinfo')">
      <template v-slot:prepend>
        <v-avatar>
          <v-img
            :src="PREFIX + (auth.user.profile.length < 1 ? '/no-profile.svg' : auth.user.profile)"
          ></v-img>
        </v-avatar>
      </template>
      <v-list-item-title>{{ auth.user.name }}</v-list-item-title>
      <v-list-item-subtitle>{{ auth.user.id }}</v-list-item-subtitle>
      <v-tooltip activator="parent"> 클릭하시면 내 정보를 수정하러 이동합니다. </v-tooltip>
    </v-list-item>
    <v-list-item>포인트 {{ auth.user.point }} 점 </v-list-item>
    <v-list-item>레벨 {{ auth.user.level }} </v-list-item>
    <v-list-item v-if="auth.user.admin">환영합니다, 관리자님! </v-list-item>
    <v-divider></v-divider>
  </v-list>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../store/auth"
import { useUtilStore } from "../../store/util"

const auth = useAuthStore()
const util = useUtilStore()
const PREFIX = process.env.PREFIX || ""
</script>
