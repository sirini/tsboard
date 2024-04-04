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
              <v-btn @click="auth.logout" append-icon="mdi-chevron-right">{{
                TEXT[home.lang].LOGOUT
              }}</v-btn>
            </v-card-actions>

            <v-card-actions v-else>
              <v-btn prepend-icon="mdi-login-variant" @click="util.go('login')">{{
                TEXT[home.lang].LOGIN
              }}</v-btn>
              <v-spacer></v-spacer>
              <v-btn append-icon="mdi-chevron-right" @click="util.go('home')">{{
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

const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()
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
