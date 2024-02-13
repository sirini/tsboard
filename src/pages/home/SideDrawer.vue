<template>
  <v-navigation-drawer v-model="home.drawer" width="250">
    <side-drawer-login v-if="auth.user.uid < 1"></side-drawer-login>
    <side-drawer-myinfo v-else></side-drawer-myinfo>
    <side-drawer-board-list></side-drawer-board-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../store/auth"
import { useHomeStore } from "../../store/home"
import SideDrawerLogin from "./SideDrawerLogin.vue"
import SideDrawerMyinfo from "./SideDrawerMyinfo.vue"
import SideDrawerBoardList from "./SideDrawerBoardList.vue"

const auth = useAuthStore()
const home = useHomeStore()
</script>
