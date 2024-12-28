<template>
  <v-app :style="bgColor" :theme="COLOR.HOME.THEME">
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card
            rounded="xl"
            class="mx-auto"
            :max-width="home.dialogWidth"
            :color="COLOR.HOME.MAIN"
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
                  rounded="pill"
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
                  rounded="pill"
                ></v-text-field>
              </v-list-item>

              <v-card class="mt-2 mb-2" variant="tonal" :color="COLOR.HOME.MAIN" rounded="xl">
                <v-card-text class="text-medium-emphasis text-caption">
                  {{ TEXT[home.lang].DESCRIPTION }}
                </v-card-text>
              </v-card>
            </v-list>

            <v-list v-if="OAUTH.IS_READY">
              <v-list-item class="text-center mb-4">
                <v-avatar
                  size="large"
                  @click="oauthLogin('google')"
                  class="mr-2"
                  v-if="OAUTH.USE.GOOGLE"
                >
                  <v-img
                    :src="TSBOARD.PREFIX + '/google/web_light_rd_na.svg'"
                    width="64"
                    height="64"
                  ></v-img>
                  <v-tooltip activator="parent">{{
                    TEXT[home.lang].GOOGLE_LOGIN_TOOLTIP
                  }}</v-tooltip>
                </v-avatar>

                <v-avatar
                  size="large"
                  @click="oauthLogin('naver')"
                  class="ml-2 mr-2"
                  v-if="OAUTH.USE.GOOGLE"
                >
                  <v-img
                    :src="TSBOARD.PREFIX + '/naver/btnG_icon_circle.png'"
                    width="64"
                    height="64"
                  ></v-img>
                  <v-tooltip activator="parent">{{
                    TEXT[home.lang].NAVER_LOGIN_TOOLTIP
                  }}</v-tooltip>
                </v-avatar>

                <v-avatar
                  size="large"
                  @click="oauthLogin('kakao')"
                  class="ml-2"
                  v-if="OAUTH.USE.KAKAO"
                >
                  <v-img
                    :src="TSBOARD.PREFIX + '/kakao/btn-kakao-login.webp'"
                    width="64"
                    height="64"
                  ></v-img>
                  <v-tooltip activator="parent">{{
                    TEXT[home.lang].KAKAO_LOGIN_TOOLTIP
                  }}</v-tooltip>
                </v-avatar>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                prepend-icon="mdi-lock-question"
                @click="util.go('resetpassword')"
                rounded="pill"
                >{{ TEXT[home.lang].RESET_PASSWORD }}</v-btn
              >
              <v-btn prepend-icon="mdi-account-plus" @click="util.go('signup')" rounded="pill">{{
                TEXT[home.lang].SIGNUP
              }}</v-btn>
              <v-spacer></v-spacer>
              <v-btn append-icon="mdi-chevron-right" @click="auth.login" rounded="pill">{{
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
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { COLOR, OAUTH, TSBOARD } from "../../../tsboard.config"
import AlertBar from "../../components/util/AlertBar.vue"
import { TEXT } from "../../messages/pages/auth/login"
import { useHomeStore } from "../../store/home"
import { useAuthStore } from "../../store/user/auth"
import { useUtilStore } from "../../store/util"
import HomeFooter from "../home/HomeFooter.vue"
import HomeHeader from "../home/HomeHeader.vue"

const route = useRoute()
const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()
const visible = ref<boolean>(false)
const bgColor = `background-color: ${COLOR.HOME.BACKGROUND}`

// OAuth 로그인하기
function oauthLogin(service: string): void {
  location.href = `${TSBOARD.API}/auth/${service}/request`
}

// OAuth 로그인 성공 시 처리
onMounted(() => {
  if (route.name === "oauthLogin") {
    auth.loadOAuthUserInfo()
  }
})
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 130px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.info {
  color: #cfd8dc;
  font-size: 0.7em;
}
</style>
