<template>
  <v-card-title class="list_title"
    >테스트 게시판
    <span class="info ml-3 pl-3"
      ><v-icon>mdi-information-outline</v-icon> IT 커뮤니티 사이트들의 게시판을 참조하여
      개발중입니다.</span
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
import { useAuthStore } from "../../../store/auth"
import { useBoardListStore } from "../../../store/board/list"
import { useUtilStore } from "../../../store/util"

const auth = useAuthStore()
const list = useBoardListStore()
const util = useUtilStore()
</script>

<style scoped>
.list_title {
  border-bottom: 1px #828282 solid;
}

.info {
  color: #828282;
  font-size: 0.65em;
}
.login {
  position: absolute;
  top: 10px;
  right: 0px;
}
</style>
