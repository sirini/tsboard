<template>
  <v-card-title class="pt-3 pb-3"
    >테스트 갤러리
    <span class="info ml-3 pl-3">인스타그램 느낌이 1g 정도 담긴 사진 갤러리 구성중입니다.</span>
    <div class="login">
      <v-btn prepend-icon="mdi-login-variant" variant="text" @click="auth.login">로그인 </v-btn>
      <v-btn
        prepend-icon="mdi-cog-outline"
        variant="text"
        @click="util.go('adminBoardManager', gallery.id)"
        :disabled="!auth.user.admin"
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
import { useGalleryStore } from "../../../store/gallery"
import { useUtilStore } from "../../../store/util"

const auth = useAuthStore()
const gallery = useGalleryStore()
const util = useUtilStore()
</script>

<style scoped>
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
