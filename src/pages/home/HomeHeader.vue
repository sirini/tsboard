<template>
  <v-app-bar flat rounded="0">
    <v-toolbar color="white">
      <v-app-bar-title>
        <v-app-bar-nav-icon @click="home.drawer = !home.drawer"></v-app-bar-nav-icon>
        <span class="logo" @click="home.main"
          >TSBOARD
          <div class="ts"></div>
        </span>

        <v-btn size="large" class="firstTopButton"
          >게시판
          <v-menu activator="parent" open-on-hover>
            <v-list>
              <v-list-item
                v-for="(board, index) in boards"
                :key="index"
                @click="home.board(board.id)"
              >
                <v-list-item-title
                  >{{ board.name }}
                  <v-tooltip activator="parent">{{ board.info }}</v-tooltip>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
        <v-btn size="large">
          갤러리
          <v-menu activator="parent" open-on-hover>
            <v-list>
              <v-list-item
                v-for="(gallery, index) in galleries"
                :key="index"
                @click="home.gallery(gallery.id)"
              >
                <v-list-item-title>
                  {{ gallery.name }}
                  <v-tooltip activator="parent">{{ gallery.info }}</v-tooltip>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-badge color="error" dot>
          <v-icon @click=""
            >mdi-bell
            <v-tooltip activator="parent">나에게 온 알림 확인하기</v-tooltip>
          </v-icon>
        </v-badge>
      </v-btn>
    </v-toolbar>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useHomeStore } from "../../store/home"

const home = useHomeStore()

interface Menu {
  id: string
  name: string
  info: string
}
const boards = ref<Menu[]>([
  {
    id: "test",
    name: "테스트 게시판",
    info: "IT 커뮤니티 사이트들의 게시판을 참조하여 개발중입니다.",
  },
])
const galleries = ref<Menu[]>([
  {
    id: "test",
    name: "테스트 갤러리",
    info: "인스타그램 느낌이 1g 정도 담긴 사진 갤러리 구성중입니다.",
  },
])
</script>

<style type="scss" scoped>
.logo {
  position: absolute;
  top: 16px;
  left: 75px;
  font-family: "Oswald", sans-serif;
  font-size: 1.4em;
  cursor: pointer;

  .ts {
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: #3178c6;
    opacity: 0.1;
    width: 25px;
    height: 30px;
  }
}
.firstTopButton {
  margin-left: 180px;
}
</style>
