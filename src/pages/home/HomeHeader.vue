<template>
  <v-app-bar rounded="0" flat :color="COLOR.HOME.TOOLBAR">
    <v-toolbar :color="COLOR.HOME.TOOLBAR">
      <v-app-bar-nav-icon icon="mdi-menu" @click="home.drawer = !home.drawer"></v-app-bar-nav-icon>
      <v-app-bar-title
        @click="home.coming"
        class="title"
        :class="home.isMobile ? 'mobile-title' : ''"
      >
        <div>{{ TSBOARD.SITE.NAME }}</div>
      </v-app-bar-title>

      <v-spacer v-if="home.isMobile || home.isTablet"></v-spacer>
      <home-header-search
        :is-small-screen="false"
        v-else-if="route.name === 'home'"
      ></home-header-search>
      <v-spacer v-if="home.isPC || home.isLarge"></v-spacer>

      <home-header-select-language v-if="home.isMobile === false"></home-header-select-language>
      <home-header-login></home-header-login>
      <home-header-notification></home-header-notification>
    </v-toolbar>

    <chat-dialog></chat-dialog>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useHomeStore } from "../../store/home"
import ChatDialog from "../../components/user/ChatDialog.vue"
import HomeHeaderSearch from "./components/header/HomeHeaderSearch.vue"
import HomeHeaderSelectLanguage from "./components/header/HomeHeaderSelectLanguage.vue"
import HomeHeaderLogin from "./components/header/HomeHeaderLogin.vue"
import HomeHeaderNotification from "./components/header/HomeHeaderNotification.vue"
import { COLOR, TSBOARD } from "../../../tsboard.config"

const route = useRoute()
const home = useHomeStore()
</script>

<style scoped type="scss">
.title {
  cursor: pointer;
  font-family: "Cal Sans", sans-serif;
  font-size: 1.6em;
}
.mobile-title {
  position: absolute;
  top: 20px;
  left: 50px;
}
</style>
