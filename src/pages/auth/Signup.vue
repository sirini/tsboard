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
            :loading="signup.loading"
          >
            <v-card-title
              >{{ TEXT[home.lang].TITLE }}
              <span class="info ml-3 pl-3">{{ TEXT[home.lang].INFO }}</span>
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
                  :rules="auth.emailRule"
                  :label="TEXT[home.lang].FILL_EMAIL"
                  append-inner-icon="mdi-check-circle-outline"
                  @click:append-inner="signup.checkEmail"
                  @blur="signup.checkEmail"
                >
                </v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.password"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  class="mt-2"
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
                  class="mt-2"
                  :label="TEXT[home.lang].AGAIN_PASSWORD"
                  :rules="auth.passwordRule"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                ></v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.name"
                  variant="outlined"
                  class="mt-2"
                  prepend-inner-icon="mdi-card-account-details-outline"
                  :label="TEXT[home.lang].FILL_NAME"
                  append-inner-icon="mdi-check-circle-outline"
                  @click:append-inner="signup.checkName"
                  :rules="auth.nameRule"
                ></v-text-field>
              </v-list-item>

              <v-card class="mt-2 mb-6" variant="tonal" color="blue-grey">
                <v-card-text class="text-medium-emphasis text-caption">
                  {{ TEXT[home.lang].DESCRIPTION }}
                </v-card-text>
              </v-card>
            </v-list>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn prepend-icon="mdi-login-variant" @click="util.go('login')">{{
                TEXT[home.lang].LOGIN
              }}</v-btn>
              <v-spacer></v-spacer>
              <v-btn append-icon="mdi-chevron-right" @click="signup.submit">{{
                TEXT[home.lang].SUBMIT
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
import { useAuthStore } from "../../store/user/auth"
import { useSignupStore } from "../../store/user/signup"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import AlertBar from "../../components/util/AlertBar.vue"
import { TEXT } from "../../messages/pages/auth/signup"

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
