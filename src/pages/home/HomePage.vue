<template>
  <v-app class="app">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-card class="mx-auto wrap app pb-12" elevation="0" rounded="0" :max-width="home.width">
          <home-title></home-title>

          <v-row class="mt-3 mb-3" v-if="home.isMobile || home.isTablet">
            <v-col>
              <v-card :color="home.color.header" class="pt-1 pb-1">
                <home-header-search :is-small-screen="true"></home-header-search>
              </v-card>
            </v-col>
          </v-row>

          <v-tabs v-model="home.tab" align-tabs="center" :color="home.color.header">
            <v-tab :value="1">CATEGORY</v-tab>
            <v-tab :value="2">LATEST</v-tab>
          </v-tabs>

          <v-tabs-window v-model="home.tab">
            <v-tabs-window-item :value="1">
              <home-page-category-window></home-page-category-window>
            </v-tabs-window-item>
            <v-tabs-window-item :value="2">
              <home-page-latest-window></home-page-latest-window>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card>

        <home-footer></home-footer>

        <quick-button v-if="home.isMobile"></quick-button>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../store/home"
import HomeHeaderSearch from "./components/header/HomeHeaderSearch.vue"
import QuickButton from "./components/mobile/QuickButton.vue"
import HomeTitle from "./components/static/TsboardHomeTitle.vue"
import HomeFooter from "./HomeFooter.vue"
import HomeHeader from "./HomeHeader.vue"
import HomePageCategoryWindow from "./HomePageCategoryWindow.vue"
import HomePageLatestWindow from "./HomePageLatestWindow.vue"
import SideDrawer from "./SideDrawer.vue"

const home = useHomeStore()
</script>

<style scoped>
.app {
  background-color: #eceff1;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.layout {
  margin-top: 64px;
}
</style>
