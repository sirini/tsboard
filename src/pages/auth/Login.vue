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
            <v-card-title class="login_title"
              >로그인
              <span class="info ml-3">다시 오신 것을 환영합니다!</span>
            </v-card-title>
            <v-divider></v-divider>

            <v-list><alert-bar></alert-bar></v-list>
            <v-list class="pl-6 pr-6">
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.id"
                  variant="outlined"
                  class="mt-6"
                  prepend-inner-icon="mdi-email-outline"
                  label="아이디(이메일 주소)를 입력해 주세요"
                  @keyup.enter="auth.login"
                ></v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.password"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  placeholder="비밀번호를 입력해 주세요"
                  :rules="auth.passwordRule"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                  @keyup.enter="auth.login"
                ></v-text-field>
              </v-list-item>

              <v-card class="mt-2 mb-6" variant="tonal" color="blue-grey">
                <v-card-text class="text-medium-emphasis text-caption">
                  게시글 및 댓글 작성, 좋아요/쪽지 기능 등은 모두 로그인 후 이용 가능합니다. 로그인
                  후 세션 관련 문제가 발생할 시 로그아웃 이후 다시 로그인을 부탁드립니다. 혹시
                  비밀번호를 잊으셨을 경우 최초 가입 시 작성하신 아이디(이메일)로 초기화한
                  비밀번호를 전해드리겠습니다.
                </v-card-text>
              </v-card>
            </v-list>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn prepend-icon="mdi-lock-question" @click="util.go('resetpassword')"
                >비번 초기화</v-btn
              >
              <v-btn prepend-icon="mdi-account-plus" @click="util.go('signup')">회원가입</v-btn>
              <v-spacer></v-spacer>
              <v-btn append-icon="mdi-chevron-right" @click="auth.login">로그인</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "../../store/user/auth"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import AlertBar from "../../components/util/AlertBar.vue"

const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()
const visible = ref<boolean>(false)
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
