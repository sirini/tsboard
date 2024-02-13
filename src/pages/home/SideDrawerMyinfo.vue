<template>
  <v-list density="compact">
    <v-list-subheader>내 정보</v-list-subheader>
    <v-divider></v-divider>
    <v-list-item
      @click="util.go('myinfo')"
      :prepend-avatar="
        PREFIX + (auth.user.profile.length < 1 ? '/no-profile.svg' : auth.user.profile)
      "
    >
      <v-list-item-title>{{ auth.user.name }}</v-list-item-title>
      <v-list-item-subtitle class="email">{{ auth.user.id }}</v-list-item-subtitle>
      <v-tooltip activator="parent"> 클릭하시면 내 정보를 수정하러 이동합니다. </v-tooltip>
    </v-list-item>
    <v-list-item class="text-center">
      <v-chip color="blue-grey" prepend-icon="mdi-alpha-l" append-icon="mdi-alpha-p">
        {{ auth.user.level }}
        <v-divider vertical class="ml-2 mr-2"></v-divider>
        {{ auth.user.point }}
      </v-chip>
    </v-list-item>
    <v-list-item v-if="auth.user.admin" class="message">환영합니다, 관리자님! </v-list-item>
    <v-list-item v-else>환영합니다, {{ auth.user.name }}님!</v-list-item>
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

<style scoped>
.email {
  font-size: 0.8em;
}
.message {
  font-size: 0.9em;
}
</style>
