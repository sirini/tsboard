<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card elevation="0" rounded="0" class="mx-auto" max-width="500">
            <v-card-title class="title">
              404 Not Found
              <span class="info ml-3 pl-3">페이지를 찾을 수 없습니다</span>
            </v-card-title>

            <v-list>
              <v-list-item prepend-icon="mdi-robot-confused-outline">
                혹시 URL에 철자가 잘못 입력되진 않았을까요?
              </v-list-item>
            </v-list>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                prepend-icon="mdi-home"
                append-icon="mdi-chevron-right"
                @click="util.go('home')"
                color="primary"
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

const util = useUtilStore()
const home = useHomeStore()

home.color = "blue-grey-lighten-5"
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.title {
  border-bottom: 1px #828282 solid;
}
.info {
  color: #828282;
  font-size: 0.65em;
  border-left: 1px #dddddd solid;
}
</style>
