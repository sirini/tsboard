<template>
  <v-app class="app">
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card
            class="mx-auto"
            rounded="lg"
            :max-width="home.dialogWidth"
            :color="home.color.header"
          >
            <v-card-title>
              {{ TEXT[home.lang].TITLE }}
              <span class="info ml-3">{{ TEXT[home.lang].INFO }}</span>
            </v-card-title>
            <v-divider></v-divider>

            <v-list class="pa-0"><alert-bar></alert-bar></v-list>
            <v-list class="pl-6 pr-6">
              <v-list-item class="pa-0 text-center">
                <v-chip
                  size="x-large"
                  :color="home.color.header"
                  class="mt-9 mb-9"
                  :prepend-avatar="TSBOARD.PREFIX + (auth.user.profile || '/no-profile.svg')"
                >
                  {{ auth.user.id }}
                  <v-divider vertical class="ml-2 mr-2"></v-divider>
                  <v-icon>mdi-alpha-l</v-icon> {{ auth.user.level }}
                  <v-divider vertical class="ml-2 mr-2"></v-divider>
                  <v-icon>mdi-alpha-p</v-icon> {{ auth.user.point }}
                  <v-tooltip activator="parent">{{ TEXT[home.lang].EMAIL_TOOLTIP }}</v-tooltip>
                </v-chip>
              </v-list-item>

              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.name"
                  variant="outlined"
                  class="mt-3"
                  :rules="auth.nameRule"
                  prepend-inner-icon="mdi-card-account-details-outline"
                  :label="TEXT[home.lang].FILL_NAME"
                  append-inner-icon="mdi-check-circle-outline"
                  @click:append-inner="signup.checkName"
                ></v-text-field>
              </v-list-item>

              <v-list-item class="pa-0">
                <v-file-input
                  variant="outlined"
                  hide-details
                  class="mt-1 mb-3"
                  prepend-icon="mdi-camera"
                  accept="image/*"
                  :label="TEXT[home.lang].CHOOSE_PROFILE"
                  @change="auth.selectProfileImage"
                ></v-file-input>
              </v-list-item>

              <v-list-item class="pa-0">
                <v-textarea
                  v-model="auth.user.signature"
                  variant="outlined"
                  class="mt-3"
                  :label="TEXT[home.lang].FILL_SIGNATURE"
                  counter
                  rows="2"
                  auto-grow
                ></v-textarea>
              </v-list-item>

              <v-list-item class="pa-0 text-caption">
                <template v-slot:prepend>
                  <v-icon class="mr-2">mdi-account-check-outline</v-icon>
                  {{ util.date(auth.user.signup) }} {{ TEXT[home.lang].SIGNUP_DATE }}
                </template>
                <template v-slot:append>
                  <v-icon class="mr-2">mdi-login-variant</v-icon>
                  {{ util.date(auth.user.signin) }} {{ TEXT[home.lang].SIGNIN_DATE }}
                </template>
              </v-list-item>

              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.password"
                  class="mt-3"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  :placeholder="TEXT[home.lang].FILL_PASSWORD"
                  :rules="auth.passwordRule"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                ></v-text-field>
              </v-list-item>

              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.checkedPassword"
                  class="mt-3"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  :placeholder="TEXT[home.lang].AGAIN_PASSWORD"
                  :rules="auth.passwordRule"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                ></v-text-field>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn prepend-icon="mdi-chevron-left" @click="util.back">{{
                TEXT[home.lang].BACK
              }}</v-btn>
              <v-spacer></v-spacer>
              <v-btn append-icon="mdi-chevron-right" @click="auth.updateMyInfo">{{
                TEXT[home.lang].SAVE
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
import { TSBOARD } from "../../../tsboard.config"
import AlertBar from "../../components/util/AlertBar.vue"
import { TEXT } from "../../messages/pages/auth/my-info"
import { useHomeStore } from "../../store/home"
import { useAuthStore } from "../../store/user/auth"
import { useSignupStore } from "../../store/user/signup"
import { useUtilStore } from "../../store/util"
import HomeFooter from "../home/HomeFooter.vue"
import HomeHeader from "../home/HomeHeader.vue"

const auth = useAuthStore()
const signup = useSignupStore()
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
  background-color: #eceff1;
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
