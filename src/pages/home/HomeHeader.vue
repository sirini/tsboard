<template>
  <v-app-bar flat rounded="0">
    <v-toolbar color="white" class="toolbar">
      <v-app-bar-title>
        <span class="logo" @click="util.go('home')">TSBOARD</span>

        <v-btn size="large" class="firstTopButton btn"
          >BOARD
          <v-menu activator="parent" open-on-hover>
            <v-list>
              <v-list-item
                v-for="(board, index) in boards"
                :key="index"
                @click="util.go('boardList', board.id)"
              >
                <v-list-item-title
                  >{{ board.name }}
                  <v-tooltip activator="parent">{{ board.info }}</v-tooltip>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
        <v-btn size="large" class="btn">
          GALLERY
          <v-menu activator="parent" open-on-hover>
            <v-list>
              <v-list-item
                v-for="(gallery, index) in galleries"
                :key="index"
                @click="util.go('galleryList', gallery.id)"
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

      <v-btn icon @click="util.go('login')" v-if="auth.user.uid < 1">
        <v-icon>mdi-login-variant</v-icon>
        <v-tooltip activator="parent"> 로그인 페이지로 이동합니다. </v-tooltip>
      </v-btn>

      <v-btn icon @click="util.go('logout')" v-else>
        <v-icon>mdi-logout-variant</v-icon>
        <v-tooltip activator="parent">로그아웃 페이지로 이동합니다.</v-tooltip>
      </v-btn>

      <v-btn icon>
        <v-badge color="error" dot>
          <v-icon @click=""
            >mdi-bell
            <v-tooltip activator="parent">나에게 온 알림 확인하기</v-tooltip>
          </v-icon>
        </v-badge>
        <v-menu activator="parent" open-on-hover>
          <v-list>
            <v-list-item :prepend-avatar="PREFIX + '/no-profile.png'" @click="">
              일지매님이 내 댓글을 좋아합니다.
            </v-list-item>
            <v-list-item :prepend-avatar="PREFIX + '/no-profile.png'" @click="">
              홍길동님이 내 글을 좋아합니다.
            </v-list-item>
            <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/lists/5.jpg" @click="">
              테스터님이 내 글에 댓글을 남겼습니다.
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </v-toolbar>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "../../store/auth"
import { useUtilStore } from "../../store/util"

const auth = useAuthStore()
const util = useUtilStore()
const PREFIX = process.env.PREFIX || ""

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
.toolbar {
  .logo {
    position: absolute;
    top: 18px;
    left: 60px;
    font-family: "Oswald", sans-serif;
    font-size: 1.3em;
    cursor: pointer;
    font-weight: bold;
  }
  .firstTopButton {
    margin-left: 170px;
  }
  .btn {
    font-family: "Oswald", sans-serif;
    font-size: 1em;
  }
}
</style>
