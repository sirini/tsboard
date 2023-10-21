<template>
  <v-card-title class="list_title pt-3 pb-3"
    >테스트 게시판
    <span class="info ml-3 pl-3">IT 커뮤니티 사이트들의 게시판을 참조하여 개발중입니다.</span>
    <div class="login">
      <v-btn prepend-icon="mdi-login-variant" variant="text" @click="auth.goLoginPage"
        >로그인
      </v-btn>
      <v-btn prepend-icon="mdi-pencil" variant="text" @click="board.goWritePage(id)"
        >새글쓰기</v-btn
      >
    </div>
  </v-card-title>

  <v-snackbar v-model="board.snackbar" :timeout="board.snackbarTimeout">
    {{ board.snackbarText }}
    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="board.snackbar = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useAuthStore } from "../../../store/auth"
import { useBoardStore } from "../../../store/board"

const route = useRoute()
const auth = useAuthStore()
const board = useBoardStore()
const id = route.params?.id.toString()
</script>

<style scoped>
.list_title {
  border-bottom: 1px #828282 solid;
}

.info {
  color: #828282;
  font-size: 0.65em;
  border-left: 1px #dddddd solid;
}
.login {
  position: absolute;
  top: 10px;
  right: 0px;
}
</style>
