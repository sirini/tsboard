<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <v-card
            class="mx-auto mt-12 mb-12"
            :max-width="home.staticWidth"
            :color="home.color.header"
          >
            <v-card-title>
              404 Not Found
              <span class="info ml-3 pl-3">페이지를 찾을 수 없습니다</span>
            </v-card-title>
            <v-divider></v-divider>

            <p class="pa-6">
              <v-icon class="mr-2">mdi-robot-confused-outline</v-icon>
              혹시 URL에 철자가 잘못 입력되진 않았을까요? 문제가 지속되면
              <strong>관리자에게 문의</strong>해주세요!
            </p>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                block
                prepend-icon="mdi-home"
                append-icon="mdi-chevron-right"
                @click="util.go('home')"
                >첫화면으로 이동</v-btn
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

const util = useUtilStore()
const home = useHomeStore()
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.info {
  color: #cfd8dc;
  font-size: 0.7em;
}
</style>
