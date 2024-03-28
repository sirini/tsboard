<template>
  <v-card-title class="list_title"
    >{{ util.unescape(name) }}
    <span class="info ml-3 pl-3" v-if="home.cols < TSBOARD.SCREEN.MOBILE.COLS">
      {{ util.unescape(info) }}</span
    >
    <div class="login">
      <v-btn
        v-if="auth.user.uid < 1"
        prepend-icon="mdi-login-variant"
        variant="text"
        @click="util.go('login')"
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
        v-if="auth.user.admin"
        prepend-icon="mdi-cog-outline"
        variant="text"
        @click="util.go('adminBoardManager', list.id)"
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
import { useBoardListStore } from "../../../store/board/list"
import { useUtilStore } from "../../../store/util"
import { useHomeStore } from "../../../store/home"
import { TSBOARD } from "../../../../tsboard.config"

const auth = useAuthStore()
const list = useBoardListStore()
const util = useUtilStore()
const home = useHomeStore()
const props = defineProps<{
  name: string
  info: string
}>()
</script>

<style scoped>
.list_title {
  border-bottom: 1px #828282 solid;
}

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
