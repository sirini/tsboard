<template>
  <v-app-bar rounded="0" flat :color="home.color.header" class="appbar">
    <v-toolbar :color="home.color.header">
      <v-app-bar-nav-icon icon="mdi-menu" @click="home.drawer = !home.drawer"></v-app-bar-nav-icon>
      <v-app-bar-title
        @click="home.coming"
        class="title"
        :class="home.cols > TSBOARD.SCREEN.TABLET.COLS ? 'mobile-title' : ''"
      >
        <div>TSBOARD<span>.dev</span></div>
      </v-app-bar-title>

      <v-spacer v-if="home.cols >= TSBOARD.SCREEN.TABLET.COLS"></v-spacer>
      <home-header-search v-else-if="route.name === 'home'"></home-header-search>

      <home-header-login></home-header-login>
      <home-header-chat v-if="home.cols < TSBOARD.SCREEN.MOBILE.COLS"></home-header-chat>
      <home-header-notification></home-header-notification>
    </v-toolbar>

    <chat-dialog></chat-dialog>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useHomeStore } from "../../store/home"
import { TSBOARD } from "../../../tsboard.config"
import ChatDialog from "../../components/user/ChatDialog.vue"
import HomeHeaderSearch from "./components/header/HomeHeaderSearch.vue"
import HomeHeaderLogin from "./components/header/HomeHeaderLogin.vue"
import HomeHeaderChat from "./components/header/HomeHeaderChat.vue"
import HomeHeaderNotification from "./components/header/HomeHeaderNotification.vue"

const route = useRoute()
const home = useHomeStore()
</script>

<style scoped type="scss">
.appbar {
  border-bottom: #cfd8dc 1px solid;
}
.title {
  cursor: pointer;
  font-family: "Protest Strike", sans-serif;
  font-size: 1.6em;

  span {
    opacity: 0.3;
  }
}
.mobile-title {
  position: absolute;
  top: 20px;
  left: 50px;
}
</style>
