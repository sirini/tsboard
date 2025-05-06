<template>
  <v-app-bar rounded="0" flat>
    <v-toolbar :color="COLOR.BLOG.TOOLBAR">
      <v-app-bar-nav-icon icon="mdi-menu" @click="home.drawer = !home.drawer"></v-app-bar-nav-icon>
      <v-app-bar-title
        @click="util.go(BOARD.BLOG as Board, id)"
        :class="home.isMobile ? 'mobile-title' : ''"
      >
        <span class="title">
          {{ name }}
        </span>
        <span class="info" v-if="home.isMobile === false">{{ info }}</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="util.go('home')"><v-icon>mdi-home-outline</v-icon></v-btn>
      <home-header-login></home-header-login>
      <home-header-notification v-if="home.isMobile === false"></home-header-notification>
    </v-toolbar>

    <chat-dialog></chat-dialog>
  </v-app-bar>
</template>

<script setup lang="ts">
import { COLOR } from "../../../tsboard.config"
import { BOARD, Board } from "../../interface/board_interface"
import HomeHeaderLogin from "../../pages/home/components/header/HomeHeaderLogin.vue"
import HomeHeaderNotification from "../../pages/home/components/header/HomeHeaderNotification.vue"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import ChatDialog from "../user/ChatDialog.vue"

const home = useHomeStore()
const util = useUtilStore()
const props = defineProps<{ name: string; info: string; id: string }>()
</script>

<style scoped>
.title {
  font-size: 1.15em;
  cursor: pointer;
}
.info {
  margin-left: 20px;
  font-size: 0.7em;
  font-weight: normal;
}
.mobile-title {
  position: absolute;
  top: 20px;
  left: 50px;
}
</style>
