<template>
  <v-row class="mt-16 mb-16">
    <v-col :cols="home.cols < 6 ? 6 : home.cols">
      <div class="mt-8 mb-2">
        <v-chip color="blue-grey-lighten-1" variant="outlined">{{ TSBOARD.VERSION }}</v-chip>
      </div>
      <h1 class="info">{{ TEXT[home.lang].INFO }}</h1>
      <h3 class="copy">{{ TEXT[home.lang].COPY }}</h3>
    </v-col>
    <v-col :cols="home.cols < 6 ? 6 : home.cols" class="text-center">
      <div class="mt-16">
        <v-btn
          color="blue-grey-darken-1"
          variant="outlined"
          prepend-icon="mdi-book-open-variant-outline"
          size="large"
          class="mt-2 mr-3"
          @click="util.open('https://github.com/sirini/tsboard?tab=readme-ov-file#tsboard')"
          >README</v-btn
        >
        <v-btn
          color="blue-grey-darken-1"
          append-icon="mdi-open-in-new"
          size="large"
          elevation="0"
          class="mt-2"
          @click="util.open('https://github.com/sirini/tsboard')"
          >GitHub</v-btn
        >
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../../../store/home"
import { useUtilStore } from "../../../../store/util"
import { TEXT } from "../../../../messages/pages/home/components/static/tsboard-home-title"
import { TSBOARD } from "../../../../../tsboard.config"

const home = useHomeStore()
const util = useUtilStore()
</script>

<style scoped>
.title {
  font-size: 3em;
  font-family: "Protest Strike", sans-serif;
  color: white;
  letter-spacing: 3px;
}
.info {
  background: linear-gradient(to right, #455a64, #90a4ae);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.copy {
  margin-top: 10px;
  color: #b0bec5;
}
</style>
