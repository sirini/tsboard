<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card elevation="0" rounded="0" class="mx-auto" max-width="500">
            <v-card-title class="change_password_title">
              비밀번호 변경
              <span class="info ml-3 pl-3">이곳에서 비밀번호를 변경하세요</span>
            </v-card-title>

            <alert-bar></alert-bar>

            <v-list>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.password"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  class="mt-2"
                  label="비밀번호를 입력해 주세요"
                  :rules="auth.passwordRule"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                ></v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.checkedPassword"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  class="mt-2"
                  label="비밀번호를 한 번 더 입력해 주세요"
                  :rules="auth.passwordRule"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                ></v-text-field>
              </v-list-item>
            </v-list>

            <v-card-actions>
              <v-btn prepend-icon="mdi-login-variant" @click="util.go('login')"
                >로그인 하러가기</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn color="primary" append-icon="mdi-chevron-right" @click="change"
                >비밀번호 변경하기</v-btn
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
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useAuthStore } from "../../store/auth"
import { usePasswordStore } from "../../store/password"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import AlertBar from "../../components/util/AlertBar.vue"

const route = useRoute()
const auth = useAuthStore()
const password = usePasswordStore()
const util = useUtilStore()
const home = useHomeStore()
const visible = ref<boolean>(false)
home.color = "blue-grey-lighten-5"

// 비밀번호 변경하기
function change(): void {
  const func = util.debounce(password.changePassword)
  func(parseInt(route.params.target as string), route.params.code as string)
}
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.change_password_title {
  border-bottom: 1px #828282 solid;
}
.info {
  color: #828282;
  font-size: 0.65em;
  border-left: 1px #dddddd solid;
}
</style>
