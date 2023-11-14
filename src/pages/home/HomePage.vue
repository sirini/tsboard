<template>
  <v-app class="app">
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container>
          <v-row class="mt-6">
            <v-col>
              <v-card>
                <v-card-title>공지사항</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-0">
                  <v-list lines="one">
                    <v-list-item
                      ><v-icon>mdi-chevron-right</v-icon> TSBOARD는 현재 개발중입니다.
                    </v-list-item>
                    <v-list-item
                      ><v-icon>mdi-chevron-right</v-icon> BUN / Elysia / Maria(MySQL) 이 필요합니다.
                    </v-list-item>
                    <v-list-item
                      ><v-icon>mdi-chevron-right</v-icon> Vue3 / Vuetify / Pinia / Vue Router
                      기반입니다.
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col></v-col>
            <v-col></v-col>
          </v-row>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../store/home"
import HomeHeader from "./HomeHeader.vue"
import HomeFooter from "./HomeFooter.vue"

const home = useHomeStore()
</script>

<style scoped>
.app {
  background-color: #eceff1;
}
.layout {
  margin-top: 64px;
}
</style>
