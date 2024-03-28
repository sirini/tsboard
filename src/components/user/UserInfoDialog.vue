<template>
  <v-dialog v-model="user.userInfoDialog" persistent>
    <v-card class="mx-auto" :max-width="home.dialogWidth" :color="home.color.header">
      <v-card-title>
        <span>사용자 정보</span>
        <span class="info ml-3 pl-3">사용자의 기본 정보를 확인합니다.</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-list>
        <alert-bar></alert-bar>

        <v-list-item class="text-center">
          <v-avatar :size="TSBOARD.IMAGE.PROFILE_SIZE">
            <v-img :src="TSBOARD.PREFIX + (user.info.profile || '/no-profile.svg')"></v-img>
          </v-avatar>
        </v-list-item>

        <v-list-item>
          <template v-slot:prepend>
            <v-chip size="small" color="blue-grey" class="mr-3">닉네임</v-chip>
            <span class="text-caption">{{ util.unescape(user.info.name) }}</span>
          </template>

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
          <template v-slot:prepend>
            <v-chip size="small" color="blue-grey">레벨</v-chip>
          </template>
          <template v-slot:append> Lv. {{ user.info.level }} </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item>
          <template v-slot:prepend>
            <v-chip size="small" color="blue-grey" class="mr-3">서명</v-chip>
          </template>

          <template v-slot:append>
            <span class="text-caption">{{
              util.unescape(user.info.signature) || "작성된 서명이 없습니다."
            }}</span>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item>
          <template v-slot:prepend>
            <v-chip size="small" color="blue-grey">가입일</v-chip></template
          >
          <template v-slot:append>
            <span class="text-caption">{{ util.date(user.info.signup, true, true) }}</span>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item>
          <template v-slot:prepend>
            <v-chip size="small" color="blue-grey">마지막 로그인</v-chip></template
          >
          <template v-slot:append>
            <span class="text-caption">{{ util.date(user.info.signin, true, true) }}</span>
          </template>
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
import { TSBOARD } from "../../../tsboard.config"
import AlertBar from "../util/AlertBar.vue"

const user = useUserStore()
const home = useHomeStore()
const util = useUtilStore()
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
