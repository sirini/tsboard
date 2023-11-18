<template>
  <v-list>
    <v-list-subheader>내 정보</v-list-subheader>
    <v-list-item append-icon="mdi-chevron-right" @click="util.go('myinfo')">
      <template v-slot:prepend>
        <v-avatar>
          <v-img
            :src="PREFIX + (auth.user.profile.length < 1 ? '/no-profile.png' : auth.user.profile)"
          ></v-img>
        </v-avatar>
      </template>
      <v-list-item-title>{{ auth.user.name }}</v-list-item-title>
      <v-list-item-subtitle>{{ auth.user.id }}</v-list-item-subtitle>
      <v-tooltip activator="parent"> 클릭하시면 내 정보를 수정하러 이동합니다. </v-tooltip>
    </v-list-item>
  </v-list>

  <v-list density="compact">
    <v-divider></v-divider>
    <v-list-item>
      <v-chip variant="text" class="mr-2">포인트</v-chip> {{ auth.user.point }}점
    </v-list-item>
    <v-list-item>
      <v-chip variant="text" class="mr-5">레벨</v-chip> {{ auth.user.level }}
    </v-list-item>
    <v-list-item>
      <v-chip variant="text" class="mr-3">관리자</v-chip>
      <strong v-if="auth.user.admin">YES</strong>
      <span v-else>NO</span>
    </v-list-item>
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
