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
            <v-card-title class="change_password_title">
              {{ TEXT[home.lang].TITLE }}
              <span class="info ml-3">{{ TEXT[home.lang].INFO }}</span>
            </v-card-title>
            <v-divider></v-divider>

            <v-list><alert-bar></alert-bar></v-list>
            <v-list class="pl-6 pr-6">
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.password"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  class="mt-6"
                  :label="TEXT[home.lang].FILL_PASSWORD"
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
                  class="mt-2 mb-6"
                  :label="TEXT[home.lang].AGAIN_PASSWORD"
                  :rules="auth.passwordRule"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                ></v-text-field>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn prepend-icon="mdi-login-variant" @click="util.go('login')">{{
                TEXT[home.lang].LOGIN
              }}</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" append-icon="mdi-chevron-right" @click="change">{{
                TEXT[home.lang].CHANGE_PASSWORD
              }}</v-btn>
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
import { useAuthStore } from "../../store/user/auth"
import { usePasswordStore } from "../../store/user/password"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import AlertBar from "../../components/util/AlertBar.vue"
import { TEXT } from "../../messages/pages/auth/change-password"

const route = useRoute()
const auth = useAuthStore()
const password = usePasswordStore()
const util = useUtilStore()
const home = useHomeStore()
const visible = ref<boolean>(false)

// 비밀번호 변경하기
function change(): void {
  const func = util.debounce(password.changePassword)
  func(parseInt(route.params.target as string), route.params.code as string)
}
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
../../store/user/password
