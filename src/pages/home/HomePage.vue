<template>
  <v-app class="app">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <v-row class="mt-6">
            <v-col>
              <v-card rounded="xl" class="box">
                <v-card-title class="title">TSBOARD는 무엇인가요?</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-0 list">
                  <v-list>
                    <v-list-item prepend-icon="mdi-language-typescript">
                      TSBOARD는 <strong>타입스크립트</strong>로 작성된 오픈소스 게시판입니다. (MIT
                      license)
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item prepend-icon="mdi-vuejs">
                      프론트엔드는 Vue 3 / Vuetify / Vue Router / Pinia 로 구성되어 있습니다.
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item prepend-icon="mdi-database-sync-outline">
                      백엔드는 Bun / ElysiaJS / MySQL(MariaDB) 로 구성되며, 웹서버는 Nginx를
                      권장합니다.
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card rounded="xl" class="box">
                <v-card-title class="title">왜 개발했나요?</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-0 list">
                  <v-list>
                    <v-list-item>
                      타입스크립트 언어가 마음에 들어서 이 언어로 풀스택 게시판을 만들어보고자
                      시작한 프로젝트입니다.
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      중소형 커뮤니티 사이트 제작에도 활용하고, 추후 블로그나 쇼핑몰까지 기능을
                      확장해 보려고 시작했습니다.
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item><strong>그냥 재밌어서</strong> 만들었어요. 😙</v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card rounded="xl" class="box">
                <v-card-title class="title">어디서 받나요?</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-0 list">
                  <v-list>
                    <v-list-item
                      >TSBOARD는 깃허브(Github)를 통해 소스코드 전체를 내려받으실 수 있으며,
                      운영하실 사이트의 목적에 맞게 수정하여 활용하실 수 있습니다.</v-list-item
                    >
                    <v-list-item>
                      설치 안내는 Github 페이지에서 확인 하실 수 있습니다. (준비중)
                    </v-list-item>
                  </v-list>
                </v-card-text>
                <v-divider class="mt-4"></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn prepend-icon="mdi-download" append-icon="mdi-github" color="blue-grey"
                    >Download from Github</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="mb-12">
            <v-col v-for="(post, index) in home.latestPosts" :key="index" cols="4">
              <v-card
                rounded="xl"
                class="box"
                @click="
                  util.go(
                    post.type === BOARD_TYPE.BOARD ? 'boardView' : 'galleryOpen',
                    post.id,
                    post.uid,
                  )
                "
              >
                <v-img
                  v-if="post.cover.length > 0"
                  height="200"
                  cover
                  :src="PREFIX + post.cover"
                ></v-img>
                <v-card-title class="title">
                  <v-chip size="small" class="mr-2" label color="blue-grey">{{
                    util.unescape(post.category)
                  }}</v-chip
                  >{{ util.unescape(post.title) }}</v-card-title
                >
                <v-divider></v-divider>
                <v-card-text
                  v-if="post.cover.length < 1"
                  class="content"
                  v-html="post.content"
                ></v-card-text>
                <v-divider v-if="post.cover.length < 1"></v-divider>
                <v-card-actions class="pl-3 pr-3">
                  <v-chip
                    prepend-icon="mdi-eye-outline"
                    append-icon="mdi-heart-outline"
                    color="blue-grey"
                    size="small"
                    >{{ util.num(post.hit) }}
                    <v-divider vertical class="ml-3 mr-3"></v-divider>
                    {{ util.num(post.like) }}
                  </v-chip>
                  <v-spacer></v-spacer>
                  <v-chip
                    :prepend-avatar="
                      PREFIX +
                      (post.writer.profile.length > 0 ? post.writer.profile : '/no-profile.svg')
                    "
                    size="small"
                    color="blue-grey"
                    >{{ util.unescape(post.writer.name) }}</v-chip
                  >
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card rounded="xl" class="box" :color="home.color.header">
                <v-card-title class="title load">이전 게시글 불러오기</v-card-title>
                <v-card-text class="text-center mt-6">
                  <v-icon size="150" @click="home.loadLatestPosts">mdi-restore</v-icon>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import HomeHeader from "./HomeHeader.vue"
import HomeFooter from "./HomeFooter.vue"
import SideDrawer from "./SideDrawer.vue"
import { BOARD_TYPE } from "../../interface/board"

const home = useHomeStore()
const util = useUtilStore()
const PREFIX = process.env.PREFIX || ""

onMounted(() => home.loadLatestPosts())
</script>

<style scoped>
.app {
  background-color: #eceff1;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.layout {
  margin-top: 64px;
}
.box {
  height: 300px;
  font-size: 1em;
}
.box .title {
  font-size: 1em;
  color: #37474f;
  height: 50px;
  font-weight: bold;
  overflow: hidden;
}
.box .load {
  color: white;
}
.box .list {
  line-height: 1.8em;
  font-size: 1em;
  color: #263238;
}
.box .content {
  height: 199px;
  overflow: hidden;
}
</style>
