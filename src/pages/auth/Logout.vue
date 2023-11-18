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

            <alert-bar></alert-bar>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="auth.logout" color="primary" append-icon="mdi-chevron-right">
                여기를 클릭하여 안전하게 로그아웃하기</v-btn
              ></v-card-actions
            >
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
import AlertBar from "../../components/util/AlertBar.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"

const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()

home.color = "blue-grey-lighten-5"

// 이미 로그아웃 상태이면 알려주고 홈 화면으로 이동
watchEffect(() => {
  if (auth.user.uid < 1) {
    util.alert("이미 로그아웃 하셨습니다! 홈 화면으로 이동합니다.", "error", 2000)
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
