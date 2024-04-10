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
              >{{ TEXT[home.lang].TITLE }}
              <span class="info ml-3">{{ TEXT[home.lang].INFO }}</span>
            </v-card-title>
            <v-divider></v-divider>

            <v-list><alert-bar></alert-bar></v-list>
            <v-list class="pl-6 pr-6">
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.id"
                  variant="outlined"
                  class="mt-3"
                  prepend-inner-icon="mdi-email-outline"
                  :label="TEXT[home.lang].FILL_EMAIL"
                  @keyup.enter="auth.login"
                ></v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.password"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  :placeholder="TEXT[home.lang].FILL_PASSWORD"
                  :rules="auth.passwordRule"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                  @keyup.enter="auth.login"
                ></v-text-field>
              </v-list-item>

              <v-card class="mt-2 mb-2" variant="tonal" color="blue-grey">
                <v-card-text class="text-medium-emphasis text-caption">
                  {{ TEXT[home.lang].DESCRIPTION }}
                </v-card-text>
              </v-card>
            </v-list>

            <v-list v-if="OAUTH.IS_READY">
              <v-list-item class="text-center mb-4">
                <v-avatar size="large" @click="googleLogin">
                  <v-img
                    :src="TSBOARD.PREFIX + '/google/web_light_rd_na.svg'"
                    width="64"
                    height="64"
                  ></v-img>
                  <v-tooltip activator="parent">{{
                    TEXT[home.lang].GOOGLE_LOGIN_TOOLTIP
                  }}</v-tooltip>
                </v-avatar>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn prepend-icon="mdi-lock-question" @click="util.go('resetpassword')">{{
                TEXT[home.lang].RESET_PASSWORD
              }}</v-btn>
              <v-btn prepend-icon="mdi-account-plus" @click="util.go('signup')">{{
                TEXT[home.lang].SIGNUP
              }}</v-btn>
              <v-spacer></v-spacer>
              <v-btn append-icon="mdi-chevron-right" @click="auth.login">{{
                TEXT[home.lang].LOGIN
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
import { ref, onMounted } from "vue"
import { useAuthStore } from "../../store/user/auth"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import AlertBar from "../../components/util/AlertBar.vue"
import { TEXT } from "../../messages/pages/auth/login"
import { OAUTH, TSBOARD } from "../../../tsboard.config"

const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()
const visible = ref<boolean>(false)

// 구글 로그인하기
function googleLogin(): void {
  const scope = "email profile"
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${OAUTH.GOOGLE.CLIENT_ID}&redirect_uri=${OAUTH.GOOGLE.REDIRECT_URI}&scope=${scope}&response_type=code&access_type=offline&prompt=select_account`
  window.open(authUrl, "googleLogin", "width=500,height=600")
}

// OAuth 로그인 성공 시 처리
onMounted(() => {
  window.addEventListener("message", (event) => {
    if (event.origin !== TSBOARD.SITE.URL) {
      return
    }

    if (event.data === OAUTH.SUCCESS_MESSAGE) {
      auth.loadGoogleUserInfo()
    }
  })
})
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
