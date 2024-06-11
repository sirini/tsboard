<template>
  <v-app-bar rounded="0" flat>
    <v-toolbar color="#121212" class="toolbar">
      <v-app-bar-nav-icon icon="mdi-menu" @click="home.drawer = !home.drawer"></v-app-bar-nav-icon>
      <v-app-bar-title
        @click="util.go('blogList', id)"
        :class="home.isMobile ? 'mobile-title' : ''"
      >
        <span class="title">
          {{ name }}
        </span>
        <span class="info" v-if="home.isMobile === false">{{ info }}</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <home-header-login></home-header-login>
      <home-header-notification v-if="home.isMobile === false"></home-header-notification>
    </v-toolbar>

    <chat-dialog></chat-dialog>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import HomeHeaderLogin from "../../pages/home/components/header/HomeHeaderLogin.vue"
import HomeHeaderNotification from "../../pages/home/components/header/HomeHeaderNotification.vue"
import ChatDialog from "../user/ChatDialog.vue"

const home = useHomeStore()
const util = useUtilStore()
const props = defineProps<{ name: string; info: string; id: string }>()
</script>

<style scoped>
.toolbar {
  border-bottom: #2f2f2f 1px solid;
}
.title {
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
}
.info {
  margin-left: 20px;
  font-size: 0.8em;
  font-weight: normal;
}
.mobile-title {
  position: absolute;
  top: 20px;
  left: 50px;
}
</style>
