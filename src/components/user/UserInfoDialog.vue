<template>
  <v-dialog v-model="user.userInfoDialog" persistent>
    <v-card class="mx-auto" width="500" :color="home.color.header">
      <v-card-title>
        <span>사용자 정보</span>
        <span class="info ml-3 pl-3">다른 사용자의 정보를 확인해 볼 수 있습니다</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-list>
        <alert-bar></alert-bar>

        <v-list-item class="text-center">
          <v-avatar size="large">
            <v-img :src="PREFIX + (user.info.profile || '/no-profile.svg')"></v-img>
          </v-avatar>
        </v-list-item>

        <v-list-item>
          <v-row>
            <v-col cols="4">닉네임</v-col>
            <v-col>{{ util.unescape(user.info.name) }}</v-col>
          </v-row>

          <template v-slot:append>
            <v-chip
              size="small"
              color="warning"
              prepend-icon="mdi-account-cancel"
              v-if="user.info.blocked"
              >차단된 사용자</v-chip
            >
            <v-chip
              size="small"
              color="blue-grey"
              prepend-icon="mdi-check-decagram"
              v-if="user.info.admin"
              >관리자</v-chip
            >
          </template>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item>
          <v-row>
            <v-col cols="4">레벨</v-col>
            <v-col>{{ user.info.level }}</v-col>
          </v-row>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item>
          <v-row>
            <v-col cols="4">서명</v-col>
            <v-col>{{ util.unescape(user.info.signature) || "작성된 서명이 없습니다." }}</v-col>
          </v-row>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item>
          <v-row>
            <v-col cols="4">가입일</v-col>
            <v-col>{{ util.date(user.info.signup, true, true) }}</v-col>
          </v-row>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item>
          <v-row>
            <v-col cols="4">마지막 로그인</v-col>
            <v-col>{{ util.date(user.info.signin, true, true) }}</v-col>
          </v-row>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn block prepend-icon="mdi-close" @click="user.closeDialog">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useUserStore } from "../../store/user/user"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import AlertBar from "../util/AlertBar.vue"

const user = useUserStore()
const home = useHomeStore()
const util = useUtilStore()
const PREFIX = process.env.PREFIX || ""
</script>

<style scoped>
.info {
  color: #78909c;
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
    backdrop-filter: blur(5px);
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
