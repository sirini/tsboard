<template>
  <v-btn icon @click="util.go('login')" v-if="auth.user.uid < 1">
    <v-icon>mdi-login-variant</v-icon>
    <v-tooltip activator="parent">{{ TEXT[home.lang].LOGIN_TOOLTIP }}</v-tooltip>
  </v-btn>

  <v-btn icon @click="util.go('logout')" v-else>
    <v-icon>mdi-logout-variant</v-icon>
    <v-tooltip activator="parent">{{ TEXT[home.lang].LOGOUT_TOOLTIP }}</v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { useUtilStore } from "../../../../store/util"
import { useAuthStore } from "../../../../store/user/auth"
import { useHomeStore } from "../../../../store/home"
import { TEXT } from "../../../../messages/pages/home/components/header/home-header-login"

const util = useUtilStore()
const auth = useAuthStore()
const home = useHomeStore()
</script>
