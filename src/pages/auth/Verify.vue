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
            <v-card-title class="signup_title">
              {{ TEXT[home.lang].TITLE }}
              <span class="info ml-3">{{ TEXT[home.lang].INFO }}</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-list class="pl-2 pr-2" :bg-color="COLOR.HOME.MAIN"><alert-bar></alert-bar></v-list>

            <div class="text-center mt-9 mb-9">
              <v-otp-input
                v-model="signup.verificationCode"
                type="text"
                length="6"
                variant="outlined"
              ></v-otp-input>
            </div>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                prepend-icon="mdi-email-alert-outline"
                v-if="auth.user.id.length > 0"
                :disabled="signup.verificationCode.length > 5"
                @click="retrySendMail"
                rounded="pill"
                >{{ TEXT[home.lang].RETRY }}</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                append-icon="mdi-chevron-right"
                :disabled="signup.verificationCode.length < 6"
                @click="signup.verify(parseInt(route.params.target as string))"
                rounded="pill"
                >{{ TEXT[home.lang].CONFIRM }}</v-btn
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
import { useRoute } from "vue-router"
import { useAuthStore } from "../../store/user/auth"
import { useSignupStore } from "../../store/user/signup"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import AlertBar from "../../components/util/AlertBar.vue"
import { TEXT } from "../../messages/pages/auth/verify"
import { COLOR } from "../../../tsboard.config"

const route = useRoute()
const auth = useAuthStore()
const signup = useSignupStore()
const util = useUtilStore()
const home = useHomeStore()
const bgColor = `background-color: ${COLOR.HOME.BACKGROUND}`

// 메일 재발송하기
function retrySendMail(): void {
  const func = util.debounce(signup.submit)
  func()
}
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
