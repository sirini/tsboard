<template>
  <v-app-bar rounded="0" flat :color="home.color" class="appbar">
    <v-toolbar :color="home.color">
      <v-app-bar-nav-icon icon="mdi-menu" @click="home.drawer = !home.drawer"></v-app-bar-nav-icon>
      <v-app-bar-title @click="util.go('home')" class="pointer">
        <v-icon>mdi-alpha-t-box</v-icon>
        <v-icon>mdi-alpha-s-box</v-icon>
        <v-icon>mdi-alpha-b-box-outline</v-icon>
        <v-icon>mdi-alpha-o-box-outline</v-icon>
        <v-icon>mdi-alpha-a-box-outline</v-icon>
        <v-icon>mdi-alpha-r-box-outline</v-icon>
        <v-icon>mdi-alpha-d-box-outline</v-icon>
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
            <v-list-item :prepend-avatar="PREFIX + '/no-profile.svg'" @click="">
              일지매님이 내 댓글을 좋아합니다.
            </v-list-item>
            <v-list-item :prepend-avatar="PREFIX + '/no-profile.svg'" @click="">
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
import { useAuthStore } from "../../store/auth"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"

const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()
const PREFIX = process.env.PREFIX || ""
</script>

<style scoped>
.appbar {
  border-bottom: #cfd8dc 1px solid;
}
.pointer {
  cursor: pointer;
}
</style>
