<template>
  <v-btn icon @click="util.go('login')" v-if="auth.user.uid < 1">
    <v-icon>mdi-login-variant</v-icon>
    <v-tooltip activator="parent"> 로그인 페이지로 이동합니다. </v-tooltip>
  </v-btn>

  <v-btn icon @click="util.go('logout')" v-else>
    <v-icon>mdi-logout-variant</v-icon>
    <v-tooltip activator="parent">로그아웃 페이지로 이동합니다.</v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { useUtilStore } from "../../../../store/util"
import { useAuthStore } from "../../../../store/user/auth"

const util = useUtilStore()
const auth = useAuthStore()
</script>
