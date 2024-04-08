<template>
  <v-navigation-drawer v-model="home.drawer" :width="home.sidebarWidth" temporary>
    <side-drawer-language></side-drawer-language>
    <side-drawer-login v-if="auth.user.uid < 1"></side-drawer-login>
    <side-drawer-myinfo v-else></side-drawer-myinfo>
    <side-drawer-board-list></side-drawer-board-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../store/user/auth"
import { useHomeStore } from "../../store/home"
import SideDrawerLanguage from "./components/drawer/SideDrawerLanguage.vue"
import SideDrawerLogin from "./components/drawer/SideDrawerLogin.vue"
import SideDrawerMyinfo from "./components/drawer/SideDrawerMyinfo.vue"
import SideDrawerBoardList from "./components/drawer/SideDrawerBoardList.vue"

const auth = useAuthStore()
const home = useHomeStore()
</script>
