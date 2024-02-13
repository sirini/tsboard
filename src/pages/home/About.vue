<template>
  <v-app class="app">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <v-card class="mx-auto mt-12" max-width="1000">
            <v-card-title>사이트 소개</v-card-title>
            <v-divider></v-divider>
            <v-card-text class="about">
              <p>TSBOARD.DEV 웹사이트에 오신 것을 환영합니다.</p>
              <p>&nbsp;</p>
              <p>
                이 사이트는 TSBOARD라고 이름 지은 오픈소스 게시판 프로그램의 사용자 분들을 위해
                제작되었습니다. TSBOARD는 Github를 통해 코드를 공개하고 있으며, 23년 12월 첫 Beta
                출시를 목표로 하고 있습니다. 아직 개발 초기 단계이므로, 테스트 목적으로 먼저 사용을
                권장해 드립니다.
              </p>
              <p>&nbsp;</p>
              <p>
                TSBOARD는 우리나라 PHP 게시판의 근본이라 할 수 있는 그누보드처럼 DBMS는
                Maria(MySQL)를 그대로 사용합니다. 그 대신, 서버쪽은 Bun + Elysia 기반으로 작성되며
                모두 TypeScript 단일 언어로 작성됩니다. 클라이언트쪽은 Vue3 (Composition API) +
                Vuetify3 으로 작성되며, 마찬가지로 TypeScript로 작성됩니다.
              </p>
              <p>&nbsp;</p>
              <p>
                클라이언트의 경우 개발자의 개인적인 선호에 의해, JSX 문법 보다는 SFC (Single File
                Component) 기반인 Vue 3을 선택했습니다. 가장 범용적인 React, 혹은 가장 빠른 Svelte
                모두 고려했었지만, Vue 3의 개발 생산성도 괜찮다고 생각합니다. TSBOARD를 사용해보고
                싶으신 분들 중에서 Vue 가 처음이시라면 너무 걱정하지 마시고 차근 차근 같이 배워보면
                좋겠습니다.
              </p>
              <p>&nbsp;</p>
              <p>
                백엔드는 23년 9월 v1.0 이 공개된 Bun, 그리고 Bun 기반의 Elysia 프레임워크를
                선택했습니다. Bun은 TSBOARD 개발 편의성과 속도 측면에서 선택한 것으로, 올인원
                툴킷이자 JS/TS 런타임입니다. 아직 안정성 개선이 진행중이지만, TSBOARD가 Beta 출시될
                쯤에는 충분히 안정화 될 것으로 보입니다.
              </p>
              <p>&nbsp;</p>
              <p>
                더 나은 아키텍쳐 제안, 버그 신고, 새로운 모듈 공유 등 많은 도움 부탁드리겠습니다.
              </p>
              <p>&nbsp;</p>
              <p>감사합니다.</p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn prepend-icon="mdi-link-variant" @click="util.go('bugReport')">Github</v-btn>
              <v-spacer></v-spacer>
              <v-btn prepend-icon="mdi-link" class="mr-2" @click="util.go('typescript')">TS</v-btn>
              <v-divider vertical></v-divider>
              <v-btn prepend-icon="mdi-link" @click="util.go('vue')">Vue</v-btn>
              <v-btn prepend-icon="mdi-link" class="mr-2" @click="util.go('vuetify')"
                >Vuetify</v-btn
              >
              <v-divider vertical></v-divider>
              <v-btn prepend-icon="mdi-link" @click="util.go('bun')">Bun</v-btn>
              <v-btn prepend-icon="mdi-link" @click="util.go('elysia')">Elysia</v-btn>
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

const util = useUtilStore()
const home = useHomeStore()
</script>

<style scoped>
.app {
  background-color: #eceff1;
}
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
