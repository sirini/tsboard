<template>
  <v-card-title class="pt-3 pb-3"
    >{{ gallery.config.name }}
    <span class="info ml-3 pl-3" v-if="home.cols < TSBOARD.SCREEN.MOBILE.COLS">{{
      util.unescape(gallery.config.info)
    }}</span>
    <div class="login">
      <v-btn
        prepend-icon="mdi-login-variant"
        variant="text"
        @click="util.go('login')"
        v-if="auth.user.uid < 1"
        >로그인</v-btn
      >
      <v-btn
        v-else
        prepend-icon="mdi-badge-account-outline"
        variant="text"
        @click="util.go('myinfo')"
        >내정보</v-btn
      >
      <v-btn
        prepend-icon="mdi-cog-outline"
        variant="text"
        @click="util.go('adminBoardManager', gallery.id)"
        v-if="auth.user.admin"
        >관리</v-btn
      >
    </div>
  </v-card-title>

  <v-snackbar v-model="util.snackbar" :timeout="util.snackbarTimeout">
    {{ util.snackbarText }}
    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="util.snackbar = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../../store/user/auth"
import { useGalleryStore } from "../../../store/board/gallery/gallery"
import { useUtilStore } from "../../../store/util"
import { useHomeStore } from "../../../store/home"
import { TSBOARD } from "../../../../tsboard.config"

const auth = useAuthStore()
const gallery = useGalleryStore()
const util = useUtilStore()
const home = useHomeStore()
</script>

<style scoped>
.info {
  color: #828282;
  font-size: 0.7em;
}
.login {
  position: absolute;
  top: 10px;
  right: 0px;
}
</style>
