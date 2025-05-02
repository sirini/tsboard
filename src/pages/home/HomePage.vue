<template>
  <v-app :theme="COLOR.HOME.THEME" :style="bgColor">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-card
          class="mx-auto wrap pb-12"
          elevation="0"
          rounded="0"
          :max-width="home.width"
          :style="bgColor"
        >
          <home-title></home-title>

          <v-row class="mb-6" v-if="home.isMobile || home.isTablet">
            <v-col>
              <v-card :color="COLOR.HOME.MAIN" class="pt-1 pb-1" rounded="pill">
                <home-header-search :is-small-screen="true"></home-header-search>
              </v-card>
            </v-col>
          </v-row>

          <v-tabs v-model="home.tab" align-tabs="center" :color="COLOR.HOME.MAIN">
            <v-tab :value="1">CATEGORY</v-tab>
            <v-tab :value="2">COLUMN</v-tab>
            <v-tab :value="3">LATEST</v-tab>
          </v-tabs>

          <v-tabs-window v-model="home.tab">
            <v-tabs-window-item :value="1">
              <home-page-category-window></home-page-category-window>
            </v-tabs-window-item>
            <v-tabs-window-item :value="2">
              <home-page-column-window></home-page-column-window>
            </v-tabs-window-item>
            <v-tabs-window-item :value="3">
              <home-page-latest-window></home-page-latest-window>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card>

        <home-footer></home-footer>

        <quick-button v-if="home.isMobile"></quick-button>
      </v-main>
      <side-notification-drawer></side-notification-drawer>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useHomeStore } from "../../store/home"
import { useAuthStore } from "../../store/user/auth"
import HomeHeaderSearch from "./components/header/HomeHeaderSearch.vue"
import QuickButton from "./components/mobile/QuickButton.vue"
import HomeTitle from "./components/static/HomeTitle.vue"
import HomeFooter from "./HomeFooter.vue"
import HomeHeader from "./HomeHeader.vue"
import HomePageColumnWindow from "./HomePageColumnWindow.vue"
import HomePageCategoryWindow from "./HomePageCategoryWindow.vue"
import HomePageLatestWindow from "./HomePageLatestWindow.vue"
import SideDrawer from "./SideDrawer.vue"
import SideNotificationDrawer from "./SideNotificationDrawer.vue"
import { COLOR } from "../../../tsboard.config"

const home = useHomeStore()
const auth = useAuthStore()
const bgColor = `background-color: ${COLOR.HOME.BACKGROUND}`

onMounted(()=>{
  if (auth.user.uid > 0 && auth.user.refresh.length > 0) {
    auth.updateAccessToken()
  }
})
</script>

<style scoped>
.wrap {
  min-height: calc(100vh - 130px);
}
.layout {
  margin-top: 64px;
}
</style>
