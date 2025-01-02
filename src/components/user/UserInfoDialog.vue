<template>
  <v-dialog v-model="user.userInfoDialog" persistent>
    <v-card class="mx-auto" :max-width="home.dialogWidth" :color="COLOR.HOME.MAIN" rounded="xl">
      <v-card-title>
        <span>{{ TEXT[home.lang].TITLE }}</span>
        <span class="info ml-3 pl-3">{{ TEXT[home.lang].INFO }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-list class="pl-2 pr-2"><alert-bar></alert-bar></v-list>

      <v-list>
        <v-list-item class="text-center mt-5 mb-5">
          <v-avatar :size="SIZE.PROFILE">
            <v-img :src="TSBOARD.PREFIX + (user.info.profile || '/no-profile.svg')"></v-img>
          </v-avatar>
        </v-list-item>

        <v-list-item>
          <template v-slot:prepend>
            <v-chip size="small" :color="COLOR.HOME.MAIN" class="mr-3">{{
              TEXT[home.lang].NAME
            }}</v-chip>
            <span class="text-caption">{{ util.unescape(user.info.name) }}</span>
          </template>

          <template v-slot:append>
            <v-chip
              size="small"
              color="warning"
              prepend-icon="mdi-account-cancel"
              v-if="user.info.blocked"
              >{{ TEXT[home.lang].BLOCKED_USER }}</v-chip
            >
            <v-chip
              size="small"
              :color="COLOR.HOME.MAIN"
              prepend-icon="mdi-check-decagram"
              v-if="user.info.admin"
              >{{ TEXT[home.lang].ADMIN }}</v-chip
            >
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item>
          <template v-slot:prepend>
            <v-chip size="small" :color="COLOR.HOME.MAIN">{{ TEXT[home.lang].LEVEL }}</v-chip>
          </template>
          <template v-slot:append> Lv. {{ user.info.level }} </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item>
          <template v-slot:prepend>
            <v-chip size="small" :color="COLOR.HOME.MAIN" class="mr-3">{{
              TEXT[home.lang].SIGNATURE
            }}</v-chip>
          </template>

          <template v-slot:append>
            <span class="text-caption">{{
              util.unescape(user.info.signature) || TEXT[home.lang].NO_SIGNATURE
            }}</span>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item>
          <template v-slot:prepend>
            <v-chip size="small" :color="COLOR.HOME.MAIN">{{
              TEXT[home.lang].SIGNUP_DATE
            }}</v-chip></template
          >
          <template v-slot:append>
            <span class="text-caption">{{ util.date(user.info.signup, true, true) }}</span>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item>
          <template v-slot:prepend>
            <v-chip size="small" :color="COLOR.HOME.MAIN">{{
              TEXT[home.lang].SIGNIN_DATE
            }}</v-chip></template
          >
          <template v-slot:append>
            <span class="text-caption">{{ util.date(user.info.signin, true, true) }}</span>
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn block prepend-icon="mdi-close" @click="user.closeDialog" rounded="pill">{{
          TEXT[home.lang].CLOSE
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { COLOR, SIZE, TSBOARD } from "../../../tsboard.config"
import { TEXT } from "../../messages/components/board/user/user-info-dialog"
import { useHomeStore } from "../../store/home"
import { useUserStore } from "../../store/user/user"
import { useUtilStore } from "../../store/util"
import AlertBar from "../util/AlertBar.vue"

const user = useUserStore()
const home = useHomeStore()
const util = useUtilStore()
</script>

<style scoped>
.info {
  font-size: 0.65em;
}

/** 다이얼로그 배경 조정 */
.v-overlay--active {
  animation: tsboardCustomOverlay 0.5s ease-in forwards;
}
@keyframes tsboardCustomOverlay {
  from {
    backdrop-filter: blur(0px);
    background: rgba(0, 0, 0, 0);
  }
  to {
    backdrop-filter: blur(2px);
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
