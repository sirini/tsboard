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
            <v-card-title
              >{{ TEXT[home.lang].TITLE }}
              <span class="info ml-3">{{ TEXT[home.lang].INFO }}</span>
            </v-card-title>
            <v-divider></v-divider>

            <div class="pa-6 message">
              <span v-if="auth.user.uid < 1">{{ TEXT[home.lang].GOODBYE }}</span>

              <span v-else>
                {{ TEXT[home.lang].HOWTO }}
              </span>
            </div>

            <v-divider></v-divider>
            <v-card-actions v-if="auth.user.uid > 0">
              <v-spacer></v-spacer>
              <v-btn @click="auth.logout" append-icon="mdi-chevron-right" rounded="pill">{{
                TEXT[home.lang].LOGOUT
              }}</v-btn>
            </v-card-actions>

            <v-card-actions v-else>
              <v-btn prepend-icon="mdi-login-variant" @click="util.go('login')" rounded="pill">{{
                TEXT[home.lang].LOGIN
              }}</v-btn>
              <v-spacer></v-spacer>
              <v-btn append-icon="mdi-chevron-right" @click="util.go('home')" rounded="pill">{{
                TEXT[home.lang].HOME
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
import { useAuthStore } from "../../store/user/auth"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import { TEXT } from "../../messages/pages/auth/logout"
import { COLOR } from "../../../tsboard.config"

const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()
const bgColor = `background-color: ${COLOR.HOME.BACKGROUND}`
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
