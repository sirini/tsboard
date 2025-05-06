<template>
  <v-row class="mt-6 mb-16">
    <v-col :cols="home.cols < 6 ? 6 : home.cols">
      <div class="mt-8 mb-2">
        <v-chip :color="COLOR.HOME.MAIN" variant="tonal" size="small">{{ TSBOARD.VERSION }}</v-chip>
      </div>
      <h1 class="info">{{ TEXT[home.lang].INFO }}</h1>
      <h3 class="copy">{{ TEXT[home.lang].COPY }}</h3>
    </v-col>
    <v-col :cols="home.cols < 6 ? 6 : home.cols" class="text-center">
      <div class="mt-16">
        <v-btn
          :color="COLOR.HOME.MAIN"
          append-icon="mdi-vuetify"
          size="large"
          elevation="0"
          class="mt-3"
          rounded="pill"
          @click="util.open('https://github.com/sirini/tsboard')"
          >TSBOARD
          <v-tooltip activator="parent">
            {{ TEXT[home.lang].TSBOARD }}
          </v-tooltip>
        </v-btn>
        <v-btn
          :color="COLOR.HOME.MAIN"
          variant="outlined"
          append-icon="mdi-language-go"
          size="large"
          class="mt-3 ml-3"
          rounded="pill"
          @click="util.open('https://github.com/sirini/goapi')"
          >GOAPI
          <v-tooltip activator="parent">
            {{ TEXT[home.lang].GOAPI }}
          </v-tooltip>
        </v-btn>
        <v-btn
          :color="COLOR.HOME.MAIN"
          variant="outlined"
          append-icon="mdi-android"
          size="large"
          class="mt-3 ml-3"
          rounded="pill"
          @click="util.open('https://github.com/sirini/sensta')"
          >SENSTA
          <v-tooltip activator="parent">
            {{ TEXT[home.lang].SENSTA }}
          </v-tooltip>
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../../../store/home"
import { useUtilStore } from "../../../../store/util"
import { TEXT } from "../../../../messages/pages/home/components/static/tsboard-home-title"
import { COLOR, TSBOARD } from "../../../../../tsboard.config"

const home = useHomeStore()
const util = useUtilStore()
</script>

<style scoped>
.info {
  background: linear-gradient(to right, #525252, #969696);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.copy {
  margin-top: 10px;
  color: #969696;
}
</style>
