<template>
  <v-card-title class="list-title"
    >{{ util.unescape(name) }}
    <span class="info ml-3 pl-3" v-if="home.isMobile === false"> {{ util.unescape(info) }}</span>
    <div class="login mr-3">
      <v-btn
        v-if="auth.user.uid < 1"
        prepend-icon="mdi-login-variant"
        variant="text"
        @click="util.go('login')"
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
        v-if="auth.user.admin"
        prepend-icon="mdi-cog-outline"
        variant="text"
        @click="util.go('adminBoardManager', list.id)"
        size="small"
        >{{ TEXT[home.lang].MANAGE }}</v-btn
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
import { TEXT } from "../../../messages/components/board/common/board-header"
import { useBoardListStore } from "../../../store/board/list"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"

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
.list-title {
  border-bottom: 1px #828282 solid;
}
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
