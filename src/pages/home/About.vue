<template>
  <v-app :style="bgColor" :theme="COLOR.HOME.THEME">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <v-card
            class="mx-auto pa-5"
            :max-width="home.staticWidth"
            :color="COLOR.HOME.MAIN"
            variant="tonal"
            rounded="pill"
          >
            <strong>ABOUT TSBOARD.DEV</strong>
          </v-card>

          <v-card
            class="mx-auto mt-5 mb-12"
            :max-width="home.staticWidth"
            :color="COLOR.HOME.MAIN"
            rounded="xl"
          >
            <v-card-title>{{ TEXT[home.lang].TITLE }}</v-card-title>
            <v-divider></v-divider>

            <v-list class="about pa-6">
              <div v-html="TEXT[home.lang].INFO"></div>
            </v-list>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                prepend-icon="mdi-link-variant"
                @click="util.open('https://github.com/sirini/tsboard')"
                >TSBOARD
                <v-tooltip activator="parent">{{ TEXT[home.lang].GITHUB_TOOLTIP }}</v-tooltip>
              </v-btn>
              <v-btn
                prepend-icon="mdi-link-variant"
                @click="util.open('https://github.com/sirini/goapi')"
                >GOAPI
                <v-tooltip activator="parent">{{ TEXT[home.lang].GITHUB_TOOLTIP }}</v-tooltip>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import HomeHeader from "./HomeHeader.vue"
import HomeFooter from "./HomeFooter.vue"
import SideDrawer from "./SideDrawer.vue"
import { TEXT } from "../../messages/pages/home/about"
import { COLOR } from "../../../tsboard.config"

const util = useUtilStore()
const home = useHomeStore()
const bgColor = `background-color: ${COLOR.HOME.BACKGROUND}`
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 130px);
}
.about {
  font-size: 1em;
  line-height: 1.8em;
}
</style>
