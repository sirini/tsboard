<template>
  <v-btn icon @click="home.notiDrawer = !home.notiDrawer" :disabled="auth.user.uid < 1">
    <v-badge color="error" v-if="auth.user.uid > 0 && home.haveNewNotification" dot>
      <v-icon>mdi-bell</v-icon>
    </v-badge>
    <v-icon v-else>mdi-bell-outline</v-icon>
    <v-tooltip activator="parent">{{ TEXT[home.lang].TOOLTIP }}</v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { TEXT } from "../../../../messages/pages/home/components/header/home-header-notification"
import { useHomeStore } from "../../../../store/home"
import { useAuthStore } from "../../../../store/user/auth"

const home = useHomeStore()
const auth = useAuthStore()
</script>
