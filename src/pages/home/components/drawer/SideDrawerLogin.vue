<template>
  <v-list>
    <v-list-subheader>{{ TEXT[home.lang].TITLE }}</v-list-subheader>
    <v-list-item>
      <alert-bar class="mb-2"></alert-bar>

      <v-card elevation="0" rounded="0">
        <v-text-field
          v-model="auth.user.id"
          variant="outlined"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-card-account-details-outline"
          rounded="pill"
        ></v-text-field>

        <v-text-field
          v-model="auth.password"
          variant="outlined"
          density="compact"
          hide-details
          class="mt-2"
          :type="visible ? 'text' : 'password'"
          :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
          prepend-inner-icon="mdi-lock-outline"
          @click:append-inner="visible = !visible"
          @keyup.enter="auth.login"
          rounded="pill"
        ></v-text-field>

        <v-card-actions class="pa-0">
          <v-btn
            @click="util.go('resetpassword')"
            size="small"
            prepend-icon="mdi-lock-question"
            rounded="pill"
            >{{ TEXT[home.lang].FIND_PASSWORD }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            append-icon="mdi-chevron-right"
            color="primary"
            @click="auth.login"
            size="small"
            rounded="pill"
            >{{ TEXT[home.lang].LOGIN }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-list-item>

    <v-list-item v-if="OAUTH.IS_READY" class="text-center">
      <v-avatar @click="oauthLogin('google')" class="mr-2 pointer" v-if="OAUTH.USE.GOOGLE">
        <v-img :src="TSBOARD.PREFIX + '/google/web_light_rd_na.svg'" width="48" height="48"></v-img>
        <v-tooltip activator="parent">{{ TEXT[home.lang].GOOGLE_LOGIN_TOOLTIP }}</v-tooltip>
      </v-avatar>

      <v-avatar @click="oauthLogin('naver')" class="ml-2 mr-2 pointer" v-if="OAUTH.USE.GOOGLE">
        <v-img :src="TSBOARD.PREFIX + '/naver/btnG_icon_circle.png'" width="48" height="48"></v-img>
        <v-tooltip activator="parent">{{ TEXT[home.lang].NAVER_LOGIN_TOOLTIP }}</v-tooltip>
      </v-avatar>

      <v-avatar @click="oauthLogin('kakao')" class="ml-2 pointer" v-if="OAUTH.USE.KAKAO">
        <v-img :src="TSBOARD.PREFIX + '/kakao/btn-kakao-login.webp'" width="48" height="48"></v-img>
        <v-tooltip activator="parent">{{ TEXT[home.lang].KAKAO_LOGIN_TOOLTIP }}</v-tooltip>
      </v-avatar>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { OAUTH, TSBOARD } from "../../../../../tsboard.config"
import AlertBar from "../../../../components/util/AlertBar.vue"
import { TEXT } from "../../../../messages/pages/home/components/drawer/side-drawer-login"
import { useHomeStore } from "../../../../store/home"
import { useAuthStore } from "../../../../store/user/auth"
import { useUtilStore } from "../../../../store/util"

const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()
const visible = ref<boolean>(false)

// OAuth 로그인하기
function oauthLogin(service: string): void {
  location.href = `${TSBOARD.API}/auth/${service}/request`
}
</script>

<style lang="css" scoped>
.pointer {
  cursor: pointer;
}
</style>
