<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card elevation="0" rounded="0" class="mx-auto" max-width="500">
            <v-card-title class="logout_title"
              >로그아웃
              <span class="info ml-3 pl-3">안전하게 로그아웃 합니다</span>
            </v-card-title>

            <v-card-text v-if="auth.user.uid < 1" class="mt-6">
              안전하게 로그아웃 되셨습니다. 다음에 다시 만나요!
            </v-card-text>

            <v-card-text v-else class="mt-6">
              아래에 로그아웃하기 버튼 클릭 시 안전하게 로그아웃 하실 수 있습니다.
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="auth.logout"
                color="primary"
                append-icon="mdi-chevron-right"
                v-if="auth.user.uid > 0"
              >
                여기를 클릭하여 안전하게 로그아웃하기</v-btn
              >
              <v-btn @click="util.go('home')" color="primary" append-icon="mdi-chevron-right" v-else
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
import { watchEffect } from "vue"
import { useAuthStore } from "../../store/auth"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"

const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()

home.color = "blue-grey-lighten-5"

// 이미 로그아웃 상태이면 알려주고 홈 화면으로 이동
watchEffect(() => {
  if (auth.user.uid < 1) {
    setTimeout(() => {
      util.go("home")
    }, 2000)
  }
})
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.logout_title {
  border-bottom: 1px #828282 solid;
}
.info {
  color: #828282;
  font-size: 0.65em;
  border-left: 1px #dddddd solid;
}
</style>
