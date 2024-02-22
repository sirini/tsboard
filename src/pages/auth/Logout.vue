<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card rounded="lg" class="mt-12 mx-auto" max-width="600" :color="home.color.header">
            <v-card-title
              >로그아웃
              <span class="info ml-3">안전하게 로그아웃 합니다</span>
            </v-card-title>
            <v-divider></v-divider>

            <div class="mt-6 mb-6 ml-6 message">
              <span v-if="auth.user.uid < 1"> 안전하게 로그아웃 되셨습니다. </span>

              <span v-else>
                아래에 로그아웃하기 버튼 클릭 시 안전하게 로그아웃 하실 수 있습니다.
              </span>
            </div>

            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="auth.logout" append-icon="mdi-chevron-right" v-if="auth.user.uid > 0">
                로그아웃하기</v-btn
              >
              <v-btn @click="util.go('home')" append-icon="mdi-chevron-right" v-else
                >첫 화면으로 이동하기</v-btn
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
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.message {
  font-size: 1.2em;
}
.info {
  color: #cfd8dc;
  font-size: 0.7em;
}
</style>
