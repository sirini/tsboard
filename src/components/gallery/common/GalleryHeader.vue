<template>
  <v-card-title
    >{{ gallery.config.name }}
    <span class="info ml-3 pl-3" v-if="home.isMobile === false">{{
      util.unescape(gallery.config.info)
    }}</span>
    <div class="login mr-3">
      <v-btn
        prepend-icon="mdi-login-variant"
        variant="text"
        @click="util.go('login')"
        v-if="auth.user.uid < 1"
        size="small"
        >{{ TEXT[home.lang].LOGIN }}</v-btn
      >
      <v-btn
        v-else
        prepend-icon="mdi-badge-account-outline"
        variant="text"
        @click="util.go('myinfo')"
        size="small"
        >{{ TEXT[home.lang].MYINFO }}</v-btn
      >
      <v-btn
        prepend-icon="mdi-cog-outline"
        variant="text"
        @click="util.go('adminBoardManager', gallery.id)"
        v-if="auth.user.admin"
        size="small"
        >{{ TEXT[home.lang].MANAGE }}</v-btn
      >
    </div>
  </v-card-title>

  <v-snackbar v-model="util.snackbar" :timeout="util.snackbarTimeout">
    {{ util.snackbarText }}
    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="util.snackbar = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { TEXT } from "../../../messages/components/gallery/common/gallery-header"
import { useGalleryStore } from "../../../store/board/gallery/gallery"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"

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
  top: 20px;
  right: 0px;
}
</style>
