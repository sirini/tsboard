<template>
  <v-app class="app">
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
            <v-card-title>사이트 소개</v-card-title>
            <v-divider></v-divider>

            <v-list class="about pa-6">
              <h2>찾아와 주신 여러분, 환영합니다!</h2>
              <p>&nbsp;</p>
              <p>
                이 사이트는 <strong>TSBOARD</strong>라고 이름 지은 오픈소스 게시판(갤러리, 블로그,
                ...) 사용자 분들을 위해 제작되었습니다. TSBOARD는 Github를 통해 코드를 공개하고
                있으며, 24년 3월 첫 Beta 출시를 목표로 하고 있습니다. 아직 개발 초기 단계이므로,
                테스트 목적으로 먼저 사용을 권장해 드립니다. (발견하신 버그는 하단
                <a
                  href="https://github.com/sirini/tsboard/issues"
                  target="_blank"
                  style="text-decoration: none"
                  >버그 신고</a
                >
                버튼을 클릭해주세요!)
              </p>
              <p>&nbsp;</p>
              <p>
                TSBOARD는 <strong>Type Safety BOARD</strong>에서 이름을 따왔습니다. JavaScript의
                슈퍼셋 언어인 TypeScript에 푹 빠져 이 언어만으로 프론트엔드에서 백엔드까지 모두
                동작하는 게시판을 만들어보고 싶어 제작하였습니다. 현재는 게시판과 갤러리 기능 일부만
                제공하지만, 궁극적으로는 블로그 및 쇼핑몰 형태도 오픈소스로 제공할 예정입니다.
              </p>
              <p>&nbsp;</p>
              <p>
                TSBOARD는 우리나라 게시판의 근본이라 할 수 있는 그누보드처럼 DBMS는 Maria(MySQL)를
                그대로 사용합니다. 대신, 서버쪽은 Bun + Elysia 기반으로 작성되며
                <strong>모두 TypeScript 단일 언어로 작성</strong>됩니다. 클라이언트쪽은 Vue3
                (Composition API) + Vuetify3 으로 작성되며, 마찬가지로 TypeScript로 작성됩니다.
              </p>
              <p>&nbsp;</p>
              <p>
                백엔드는 23년 9월 v1.0 이 공개된 Bun, 그리고 Bun 기반의 Elysia 웹 프레임워크를
                선택했습니다. Bun은 TSBOARD 개발 편의성과 속도 측면에서 선택한 것으로, 올인원
                툴킷이자 JS/TS 런타임입니다. 아직 Node.js 대비 범용적인 활용에는 문제가 있지만, 점차
                나아지리라 생각합니다.
              </p>
              <p>&nbsp;</p>
              <p>
                기존에 TypeScript 언어 및 Node.js 생태계에 이미 익숙하신 개발자 분들이 보시기엔
                부족해 보일 수 있습니다. 반면 흔히 게시판 하면 생각나는
                <strong>PHP 언어에 익숙하신 분들에겐 무척 생소한 게시판</strong>이 될 수도
                있겠습니다. (저도 그랬거든요... 😅) 제가 놓치고 있거나 부족한 부분엔 따뜻한 도움의
                손길을 부탁드리며, 혹시 TypeScript 나 Vue와 같은 프레임워크 활용에 어려움이 있으신
                분들께는 이번 기회에 TSBOARD를 통해서 함께 배우고 활용해보면 좋겠습니다.
              </p>
              <p>&nbsp;</p>
              <p>
                TSBOARD.DEV 웹사이트는 방구석 미니PC 위에서 현재 힘겹게 유지되고 있습니다. 간혹
                접속이 안되더라도 너른 양해 부탁드립니다. 🥲
              </p>
            </v-list>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn prepend-icon="mdi-link-variant" @click="util.go('bugReport')"
                >Github
                <v-tooltip activator="parent"
                  >깃허브에 공개된 TSBOARD 프로젝트 보러가기 (★ 도 눌러주기 😄)</v-tooltip
                >
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn prepend-icon="mdi-link" class="mr-2" @click="util.go('typescript')"
                >TS
                <v-tooltip activator="parent">타입스크립트(TypeScript) 언어 배우러 가기!</v-tooltip>
              </v-btn>
              <v-divider vertical></v-divider>
              <v-btn prepend-icon="mdi-link" @click="util.go('vue')"
                >Vue
                <v-tooltip activator="parent">Vue 프레임워크 배우러 가기!</v-tooltip>
              </v-btn>
              <v-btn prepend-icon="mdi-link" class="mr-2" @click="util.go('vuetify')"
                >Vuetify
                <v-tooltip activator="parent">Vuetify 라이브러리 배우러 가기!</v-tooltip>
              </v-btn>
              <v-btn prepend-icon="mdi-link" class="mr-2" @click="util.go('tiptap')"
                >Tiptap
                <v-tooltip activator="parent">Tiptap 에디터 배우러 가기!</v-tooltip>
              </v-btn>
              <v-divider vertical></v-divider>
              <v-btn prepend-icon="mdi-link" @click="util.go('bun')"
                >Bun
                <v-tooltip activator="parent">JS/TS 런타임 겸 툴킷 Bun 보러가기!</v-tooltip>
              </v-btn>
              <v-btn prepend-icon="mdi-link" @click="util.go('elysia')"
                >Elysia
                <v-tooltip activator="parent"
                  >Bun 기반 빠른 웹프레임워크 Elysia 배우러 가기!</v-tooltip
                >
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
