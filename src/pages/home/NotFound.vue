<template>
  <v-app :style="bgColor" :theme="COLOR.HOME.THEME">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <v-card
            class="mx-auto mt-12 mb-12"
            :max-width="home.staticWidth"
            :color="COLOR.HOME.HEADER"
          >
            <v-card-title>
              404 Not Found
              <span class="info ml-3 pl-3">{{ TEXT[home.lang].PAGE_NOT_FOUND }}</span>
            </v-card-title>
            <v-divider></v-divider>

            <p class="pa-6">
              <v-icon class="mr-2">mdi-robot-confused-outline</v-icon>
              {{ TEXT[home.lang].SUGGESTION }}
            </p>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                block
                prepend-icon="mdi-home"
                append-icon="mdi-chevron-right"
                @click="util.go('home')"
                >{{ TEXT[home.lang].MOVE_HOME }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import HomeHeader from "./HomeHeader.vue"
import HomeFooter from "./HomeFooter.vue"
import SideDrawer from "./SideDrawer.vue"
import { TEXT } from "../../messages/pages/home/not-found"
import { COLOR } from "../../../tsboard.config"

const util = useUtilStore()
const home = useHomeStore()
const bgColor = `background-color: #${COLOR.HOME.BACKGROUND}`
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.info {
  color: #cfd8dc;
  font-size: 0.7em;
}
</style>
