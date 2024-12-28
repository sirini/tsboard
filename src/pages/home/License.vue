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
            <strong>TSBOARD LICENSE</strong>
          </v-card>

          <v-card
            class="mx-auto mt-5 mb-12"
            :max-width="home.staticWidth"
            :color="COLOR.HOME.MAIN"
            rounded="xl"
          >
            <v-card-title>MIT License</v-card-title>
            <v-list class="license pa-6">
              <p>&nbsp;</p>
              <p>Copyright © 2024 <strong>TSBOARD.DEV</strong> (sirini@gmail.com)</p>
              <p>&nbsp;</p>
              <p>
                Permission is hereby granted, free of charge, to any person obtaining a copy of this
                software and associated documentation files (the "Software"), to deal in the
                Software without restriction, including without limitation the rights to use, copy,
                modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
                and to permit persons to whom the Software is furnished to do so, subject to the
                following conditions:
              </p>
              <p>&nbsp;</p>
              <p>
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.
              </p>
              <p>&nbsp;</p>
              <p>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
                INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
                HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
                CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
                OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
              </p>
              <p>&nbsp;</p>
              <h1 class="mt-6">라이선스 요약</h1>
              <p>&nbsp;</p>
              <p>
                해당 소프트웨어(TSBOARD) 및 관련 문서 파일에 대한 복사본을 얻는 모든 사용자에게
                무료로 허용하며, 복사본을 통한 소프트웨어의 사용, 복사, 수정, 통합, 출판, 배포, 하위
                라이선스 부여, 판매 등의 제한 없는 활동을 허용합니다.
              </p>
              <p>&nbsp;</p>
              <p>
                단, 모든 복사본 또는 주요 부분에는 저작권 고지와 이 허가 통지가 포함되어야 합니다.
                또한, 이 소프트웨어는 "있는 그대로" 제공되며, 상품성, 특정 목적에의 적합성 및
                비침해성을 포함한 어떠한 보증도 없습니다. 저작자나 저작권 보유자는 소프트웨어
                사용으로 인한 모든 청구, 손해 또는 기타 책임에 대해 책임지지 않습니다.
              </p>
            </v-list>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn
                prepend-icon="mdi-link-variant"
                @click="util.open('https://github.com/sirini/tsboard')"
                rounded="pill"
                >TSBOARD</v-btn
              >
              <v-btn
                prepend-icon="mdi-link-variant"
                @click="util.open('https://github.com/sirini/goapi')"
                rounded="pill"
                >GOAPI</v-btn
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
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import HomeHeader from "./HomeHeader.vue"
import HomeFooter from "./HomeFooter.vue"
import SideDrawer from "./SideDrawer.vue"
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
.license {
  font-size: 1.2em;
  line-height: 1.8em;
}
</style>
