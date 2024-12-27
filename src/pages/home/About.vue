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
                >Github
                <v-tooltip activator="parent">{{ TEXT[home.lang].GITHUB_TOOLTIP }}</v-tooltip>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                prepend-icon="mdi-link"
                class="mr-2"
                @click="util.open('https://www.typescriptlang.org/ko/')"
                >TS
              </v-btn>
              <v-divider vertical></v-divider>
              <v-btn prepend-icon="mdi-link" @click="util.open('https://ko.vuejs.org')">Vue </v-btn>
              <v-btn
                prepend-icon="mdi-link"
                class="mr-2"
                @click="util.open('https://vuetifyjs.com')"
                >Vuetify
              </v-btn>
              <v-btn prepend-icon="mdi-link" class="mr-2" @click="util.open('https://tiptap.dev')"
                >Tiptap
              </v-btn>
              <v-divider vertical></v-divider>
              <v-btn prepend-icon="mdi-link" @click="util.open('https://bun.sh')">Bun </v-btn>
              <v-btn prepend-icon="mdi-link" @click="util.open('https://elysiajs.com')"
                >Elysia
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
const bgColor = `background-color: #${COLOR.HOME.BACKGROUND}`
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.about {
  font-size: 1em;
  line-height: 1.8em;
}
</style>
