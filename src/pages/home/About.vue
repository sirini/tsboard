<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container>
          <v-card>
            <v-card-title class="title">ABOUT <strong>TSBOARD.DEV</strong></v-card-title>
            <v-divider></v-divider>
            <v-card-text class="about">
              <p>TSBOARD.DEV 웹사이트에 오신 것을 환영합니다.</p>
              <p>&nbsp;</p>
              <p>
                이 사이트는 TSBOARD라고 이름 지은 오픈소스 게시판 프로그램의 사용자 분들을 위해
                제작되었습니다.
              </p>
              <p>
                TSBOARD는 Github를 통해 코드를 공개하고 있으며, 23년 12월 첫 Beta 출시를 목표로 하고
                있습니다.
              </p>
              <p>아직 개발 초기 단계이므로, 테스트 목적으로 먼저 사용을 권장해 드립니다.</p>
              <p>&nbsp;</p>
              <p>
                이미 많은 개발자 풀을 보유한 PHP를 선택하지 않아 의외라고 생각하실 분들도 계실 것
                같고,
              </p>
              <p>
                JavaScript와 달리 성가진 타입 체크가 필요한 TypeScript를 다시 또 배워야 하나
                걱정되는 분들도 계실 것 같습니다.
              </p>
              <p>
                개발자인 저 역시도 PHP를 아주 오랫동안 사용했었고, PHP기반 게시판 프로그램들인
                제로보드, 그누보드를 좋아합니다.
              </p>
              <p>
                여전히 해당 프로그램들의 안정성과 유연성에 감탄하지만, 동시에 대중적인 게시판
                프로그램이
              </p>
              <p>
                너무 오랫동안 예전 아키텍쳐의 제약에서 벗어나지 못하는 건 아닌가 하는 생각이
                들었습니다.
              </p>
              <p>&nbsp;</p>
              <p>
                새로운 웹 세상이 태동했고, 대중적인 게시판 프로그램들도 이제는 새로운 변화를
                맞이해야 한다고 생각했습니다.
              </p>
              <p>
                그래서 저부터 익숙한 PHP를 잠시 내려놓고, TypeScript를 배워 가면서 TSBOARD를 만들게
                되었습니다.
              </p>
              <p>
                이 프로젝트가 작은 계기가 되어, 더 많은 게시판 프로그램들이 새로운 도전에 나설 수
                있으면 좋겠습니다.
              </p>
              <p>&nbsp;</p>
              <p>
                TSBOARD는 우리나라 PHP 게시판의 근본이라 할 수 있는 그누보드처럼 DBMS는
                Maria(MySQL)를 그대로 사용합니다.
              </p>
              <p>
                그 대신, 서버쪽은 Bun + Elysia 기반으로 작성되며 모두 TypeScript 단일 언어로
                작성됩니다.
              </p>
              <p>
                클라이언트쪽은 Vue3 (Composition API) + Vuetify3 으로 작성되며, 마찬가지로
                TypeScript로 작성됩니다.
              </p>
              <p>&nbsp;</p>
              <p>
                클라이언트의 경우 개발자의 개인적인 선호에 의해, JSX 문법 보다는 SFC (Single File
                Component) 기반인 Vue 3을 선택했습니다.
              </p>
              <p>
                가장 범용적인 React, 혹은 가장 빠른 Svelte 모두 고려했었지만, Vue 3의 개발 생산성도
                괜찮다고 생각합니다.
              </p>
              <p>
                TSBOARD를 사용해보고 싶으신 분들 중에서 Vue 가 처음이시라면 너무 걱정하지 마시고
                차근 차근 같이 배워보면 좋겠습니다.
              </p>
              <p>&nbsp;</p>
              <p>
                서버는 23년 9월 v1.0 이 공개된 Bun, 그리고 Bun 기반의 Elysia 프레임워크를
                선택했습니다.
              </p>
              <p>
                Bun은 TSBOARD 개발 편의성과 속도 측면에서 선택한 것으로, 올인원 툴킷이자 JS/TS
                런타임입니다.
              </p>
              <p>
                아직 안정성 개선이 진행중이지만, TSBOARD가 Beta 출시될 쯤에는 충분히 안정화 될
                것으로 보입니다.
              </p>
              <p>&nbsp;</p>
              <p>웹은 역동적인 생태계입니다. 그리고 계속해서 변화합니다.</p>
              <p>TSBOARD는 이러한 변화를 포용하면서 여러분과 함께 배우고 성장하고 싶습니다.</p>
              <p>
                더 나은 아키텍쳐 제안, 버그 신고, 새로운 모듈 공유 등 많은 도움 부탁드리겠습니다.
              </p>
              <p>&nbsp;</p>
              <p>감사합니다.</p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn prepend-icon="mdi-link-variant" @click="home.report">버그 신고 (Github)</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                prepend-icon="mdi-link"
                class="mr-2"
                @click="router.push({ name: 'typescript' })"
                >TypeScript</v-btn
              >
              <v-divider vertical></v-divider>
              <v-btn prepend-icon="mdi-link" @click="router.push({ name: 'vue' })">Vue</v-btn>
              <v-btn prepend-icon="mdi-link" class="mr-2" @click="router.push({ name: 'vuetify' })"
                >Vuetify</v-btn
              >
              <v-divider vertical></v-divider>
              <v-btn prepend-icon="mdi-link" @click="router.push({ name: 'bun' })">Bun</v-btn>
              <v-btn prepend-icon="mdi-link" @click="router.push({ name: 'elysia' })">Elysia</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useHomeStore } from "../../store/home"
import HomeHeader from "./HomeHeader.vue"
import HomeFooter from "./HomeFooter.vue"

const router = useRouter()
const home = useHomeStore()
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.title {
  font-family: "Oswald", sans-serif;
}
.about {
  font-size: 1em;
  line-height: 1.8em;
}
</style>
