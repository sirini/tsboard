<template>
  <v-app class="app">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-card class="mx-auto wrap app" elevation="0" rounded="0" :max-width="home.width">
          <v-row class="mt-6 mb-12">
            <v-col :cols="home.cols">
              <v-card rounded="xl" class="box">
                <v-card-title class="title"
                  ><v-icon class="mr-2">mdi-pin</v-icon> TSBOARD는 무엇인가요?</v-card-title
                >
                <v-divider></v-divider>
                <v-card-text class="pa-0 list">
                  <v-list>
                    <v-list-item prepend-icon="mdi-language-typescript">
                      TSBOARD는 <strong>타입스크립트</strong>로 작성된 오픈소스 게시판입니다.
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item prepend-icon="mdi-vuejs">
                      프론트엔드는 Vue 3 / Vuetify / Vue Router / Pinia / Tiptap 으로 구성되어
                      있습니다.
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item prepend-icon="mdi-database-sync-outline">
                      백엔드는 Bun / ElysiaJS / MySQL(MariaDB) 로 구성됩니다.
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col :cols="home.cols">
              <v-card rounded="xl" class="box">
                <v-card-title class="title"
                  ><v-icon class="mr-2">mdi-pin</v-icon> 왜 개발했나요?</v-card-title
                >
                <v-divider></v-divider>
                <v-card-text class="pa-0 list">
                  <v-list>
                    <v-list-item prepend-icon="mdi-thumb-up-outline">
                      타입스크립트 언어가 마음에 들었습니다!
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item prepend-icon="mdi-head-question-outline">
                      Bun과 ElysiaJS 조합으로 어느 정도 퍼포먼스를 낼 수 있을지 궁금하기도
                      했구요!</v-list-item
                    >
                    <v-divider></v-divider>
                    <v-list-item prepend-icon="mdi-account-group">
                      Vue & Vuetify 기반 게시판을 만들면 재밌겠다 싶어서 시작했습니다!</v-list-item
                    >
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col :cols="home.cols">
              <v-card rounded="xl" class="box">
                <v-card-title class="title"
                  ><v-icon class="mr-2">mdi-pin</v-icon> 어디서 받나요?</v-card-title
                >
                <v-divider></v-divider>
                <v-card-text class="pa-0 list">
                  <v-list>
                    <v-list-item
                      >TSBOARD는 깃허브를 통해 소스코드 전체를 내려받으실 수 있으며, 사이트의 목적에
                      맞게 수정하여 활용하실 수 있습니다.</v-list-item
                    >
                    <v-divider></v-divider>
                    <v-list-item>
                      설치 안내는 Github 페이지에서 확인 하실 수 있습니다.
                    </v-list-item>
                  </v-list>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn
                    block
                    size="large"
                    prepend-icon="mdi-download"
                    append-icon="mdi-github"
                    color="blue-grey"
                    >Download from Github
                    <v-tooltip activator="parent">TSBOARD 깃허브 페이지로 이동합니다!</v-tooltip>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col :cols="home.cols">
              <v-card rounded="xl" class="box">
                <v-card-title class="title" @click="util.go('boardList', 'free')"
                  ><v-icon class="mr-2">mdi-pin</v-icon> 자유게시판</v-card-title
                >
                <v-divider></v-divider>
                <v-card-text class="pa-0 list">
                  <v-list>
                    <v-list-item
                      v-for="(post, index) in freeBoardList"
                      :key="index"
                      @click="util.go('boardView', 'free', post.uid)"
                    >
                      <template v-slot:prepend>
                        <v-chip size="small">{{ post.category }}</v-chip>
                      </template>
                      <v-list-item-title class="pl-2 pr-2">{{ post.title }}</v-list-item-title>
                      <template v-slot:append>
                        {{ util.date(post.submitted) }}
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-for="(post, index) in home.latestPosts" :key="index" :cols="home.cols">
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
                  :src="TSBOARD.PREFIX + post.cover"
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
                      TSBOARD.PREFIX +
                      (post.writer.profile.length > 0 ? post.writer.profile : '/no-profile.svg')
                    "
                    size="small"
                    color="blue-grey"
                    >{{ util.unescape(post.writer.name) }}</v-chip
                  >
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col :cols="home.cols">
              <v-card
                rounded="xl"
                class="box"
                :color="home.color.header"
                @click="home.loadLatestPosts"
                variant="outlined"
              >
                <v-card-title class="title">이전 게시글 불러오기</v-card-title>
                <v-card-text class="text-center mt-6">
                  <v-icon size="150">mdi-restore</v-icon>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import HomeHeader from "./HomeHeader.vue"
import HomeFooter from "./HomeFooter.vue"
import SideDrawer from "./SideDrawer.vue"
import { BOARD_TYPE } from "../../interface/board"
import { TSBOARD } from "../../../tsboard.config"
import { LatestPost } from "../../interface/home"

const home = useHomeStore()
const util = useUtilStore()
const freeBoardList = ref<LatestPost[]>([])

onMounted(async () => {
  home.loadLatestPosts()
  freeBoardList.value = await home.getBoardLatest("free", 5)
})
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
.box .list {
  line-height: 1.8em;
  font-size: 0.9em;
  color: #263238;
}
.box .content {
  height: 199px;
  overflow: hidden;
}
</style>
