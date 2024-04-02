<template>
  <v-app class="app">
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card
            rounded="lg"
            class="mx-auto"
            :max-width="home.dialogWidth"
            :color="home.color.header"
          >
            <v-card-title
              >로그아웃
              <span class="info ml-3">안전하게 로그아웃 합니다</span>
            </v-card-title>
            <v-divider></v-divider>

            <div class="pa-6 message">
              <span v-if="auth.user.uid < 1"> 안전하게 로그아웃 되셨습니다. 다시 만나요! 👋</span>

              <span v-else>
                아래에 로그아웃하기 버튼 클릭 시 안전하게 로그아웃 하실 수 있습니다.
              </span>
            </div>

            <v-divider></v-divider>
            <v-card-actions v-if="auth.user.uid > 0">
              <v-spacer></v-spacer>
              <v-btn @click="auth.logout" append-icon="mdi-chevron-right"> 로그아웃하기</v-btn>
            </v-card-actions>

            <v-card-actions v-else>
              <v-btn prepend-icon="mdi-login-variant" @click="util.go('login')"
                >다시 로그인하기</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn append-icon="mdi-chevron-right" @click="util.go('home')"
                >첫화면으로 이동</v-btn
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
import { useAuthStore } from "../../store/user/auth"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"

const auth = useAuthStore()
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
  display: flex;
  align-items: center;
  justify-content: center;
}
.info {
  color: #cfd8dc;
  font-size: 0.7em;
}
</style>
