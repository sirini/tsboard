<template>
  <v-dialog v-model="user.userInfoDialog" persistent>
    <v-card class="mx-auto" width="500" :color="home.color.header">
      <v-card-title>
        <span class="title">사용자 정보</span>
        <span class="info ml-3 pl-3">다른 사용자의 정보를 확인해 볼 수 있습니다</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-list>
        <v-list-item class="text-center">
          <v-avatar size="large">
            <v-img :src="PREFIX + userInfo?.profile"></v-img>
          </v-avatar>
        </v-list-item>

        <v-list-item>
          <v-row>
            <v-col cols="4">닉네임</v-col>
            <v-col>{{ userInfo?.name || "" }}</v-col>
          </v-row>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item>
          <v-row>
            <v-col cols="4">레벨</v-col>
            <v-col>{{ userInfo?.level }}</v-col>
          </v-row>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item>
          <v-row>
            <v-col cols="4">서명</v-col>
            <v-col>{{ userInfo?.signature || "작성된 서명이 없습니다." }}</v-col>
          </v-row>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item>
          <v-row>
            <v-col cols="4">가입일</v-col>
            <v-col>{{ userInfo?.signup }}</v-col>
          </v-row>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item>
          <v-row>
            <v-col cols="4">마지막 로그인</v-col>
            <v-col>{{ userInfo?.signin }}</v-col>
          </v-row>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn block prepend-icon="mdi-close" @click="user.closeUserInfo">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useUserStore } from "../../store/user"
import { useHomeStore } from "../../store/home"
import { User } from "../../interface/auth"

const user = useUserStore()
const home = useHomeStore()
const userInfo = ref<User>()
const PREFIX = process.env.PREFIX || ""

onMounted(() => {
  userInfo.value = {
    uid: user.targetUserInfo.uid,
    id: "",
    name: user.targetUserInfo.name,
    profile: user.targetUserInfo.profile,
    level: 1,
    point: 123,
    signature: "",
    signup: 0,
    signin: 0,
    admin: false,
    token: "",
  }
})
</script>

<style scoped>
.title {
  color: #37474f;
}
.info {
  color: #78909c;
  font-size: 0.65em;
  border-left: 1px #cfd8dc solid;
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
