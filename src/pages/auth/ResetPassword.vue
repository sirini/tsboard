<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card elevation="0" rounded="0" class="mx-auto" max-width="500">
            <v-card-title class="reset_password_title">
              비밀번호 초기화
              <span class="info ml-3 pl-3">비밀번호를 잊어버리셨나요?</span>
            </v-card-title>

            <alert-bar></alert-bar>

            <v-list>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.id"
                  variant="outlined"
                  class="mt-6"
                  prepend-inner-icon="mdi-email-outline"
                  :rules="auth.emailRule"
                  label="본인 아이디(이메일 주소)를 입력해 주세요"
                ></v-text-field>
              </v-list-item>
            </v-list>

            <v-card class="mb-3" color="surface-variant" variant="tonal">
              <v-card-text class="text-medium-emphasis text-caption">
                최초 가입 시점에 입력하신 이메일 주소로 초기화된 비밀번호를 발송해 드립니다. 사이트
                내에서는 상대방의 아이디(이메일 주소)를 볼 수 없도록 되어 있지만, 혹시 노출된 경우
                다른 사용자가 임의로 초기화를 시도 할 수도 있으므로 주의를 부탁드립니다.
              </v-card-text>
            </v-card>
            <v-card-actions>
              <v-btn prepend-icon="mdi-login-variant" @click="util.go('login')"
                >로그인 하러가기</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                append-icon="mdi-chevron-right"
                @click="password.askResetPassword"
                >비밀번호 초기화 요청하기</v-btn
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
import { useAuthStore } from "../../store/auth"
import { usePasswordStore } from "../../store/password"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import AlertBar from "../../components/util/AlertBar.vue"

const auth = useAuthStore()
const password = usePasswordStore()
const util = useUtilStore()
const home = useHomeStore()

home.color = "blue-grey-lighten-5"
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.reset_password_title {
  border-bottom: 1px #828282 solid;
}
.info {
  color: #828282;
  font-size: 0.65em;
  border-left: 1px #dddddd solid;
}
</style>
