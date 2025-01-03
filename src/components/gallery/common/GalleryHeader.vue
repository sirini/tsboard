<template>
  <v-card
    class="mx-auto pa-5"
    :max-width="config.width"
    :color="COLOR.HOME.MAIN"
    variant="tonal"
    rounded="pill"
  >
    <strong>{{ gallery.config.name }}</strong>
    <span class="info ml-3 pl-3" v-if="home.isMobile === false">{{
      util.unescape(gallery.config.info)
    }}</span>
    <div class="login mr-3">
      <v-btn
        prepend-icon="mdi-login-variant"
        variant="text"
        @click="util.go('login')"
        v-if="auth.user.uid < 1"
        rounded="pill"
        >{{ TEXT[home.lang].LOGIN }}</v-btn
      >
      <v-btn
        v-else
        prepend-icon="mdi-badge-account-outline"
        variant="text"
        @click="util.go('myinfo')"
        rounded="pill"
        >{{ TEXT[home.lang].MYINFO }}</v-btn
      >
      <v-btn
        prepend-icon="mdi-cog-outline"
        variant="text"
        @click="util.go('adminBoardManager', gallery.id)"
        v-if="auth.user.admin"
        rounded="pill"
        >{{ TEXT[home.lang].MANAGE }}</v-btn
      >
    </div>
  </v-card>

  <v-snackbar v-model="util.snackbar" :timeout="util.snackbarTimeout">
    {{ util.snackbarText }}
    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="util.snackbar = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { COLOR } from "../../../../tsboard.config"
import { BoardConfig } from "../../../interface/board_interface"
import { TEXT } from "../../../messages/components/gallery/common/gallery-header"
import { useGalleryStore } from "../../../store/board/gallery"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"

const auth = useAuthStore()
const gallery = useGalleryStore()
const util = useUtilStore()
const home = useHomeStore()
const props = defineProps<{
  config: BoardConfig
}>()
</script>

<style scoped>
.info {
  color: #828282;
}
.login {
  position: absolute;
  top: 13px;
  right: 0px;
}
</style>
