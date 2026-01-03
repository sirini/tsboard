<template>
  <v-row class="mt-6 mb-16">
    <v-col :cols="home.cols < 6 ? 6 : home.cols">
      <div class="mt-8 mb-2">
        <v-chip :color="COLOR.HOME.MAIN" variant="tonal" @click="util.move('https://nubohub.org')">nubohub.org</v-chip>
      </div>
      <h1 class="info">이제 NUBO에서 만나요!</h1>
      <h3 class="copy">TSBOARD의 빠른 속도를 계승한 차세대 모던 커뮤니티 빌더</h3>
    </v-col>
    <v-col :cols="home.cols < 6 ? 6 : home.cols" class="text-center">
      <div class="mt-16">
        <v-btn
          :color="COLOR.HOME.MAIN"
          append-icon="mdi-nuxt"
          size="x-large"
          elevation="0"
          class="mt-3"
          rounded="pill"
          @click="util.open('https://github.com/sirini/nubo')"
          >NUBO
          <v-tooltip activator="parent">
            TSBOARD를 계승한 차세대 모던 커뮤니티 빌더를 만나보세요!
          </v-tooltip>
        </v-btn>
        <v-btn
          :color="COLOR.HOME.MAIN"
          variant="outlined"
          append-icon="mdi-language-go"
          size="x-large"
          class="mt-3 ml-2"
          rounded="pill"
          @click="util.open('https://github.com/sirini/goapi')"
          >GOAPI
          <v-tooltip activator="parent">
            NUBO 프로젝트에 최적화된 GOAPI를 만나보세요!
          </v-tooltip>
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { COLOR } from "../../../../../tsboard.config"
import { useHomeStore } from "../../../../store/home"
import { useUtilStore } from "../../../../store/util"

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
