<template>
  <v-dialog v-model="user.userInfoDialog" persistent>
    <v-card class="mx-auto" width="500">
      <v-card-title>
        사용자 정보
        <span class="info ml-3 pl-3">다른 사용자의 정보를 확인해 볼 수 있습니다</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-list>
        <v-list-item class="text-center">
          <v-avatar size="large">
            <v-img :src="PREFIX + user.targetUserInfo.profile"></v-img>
          </v-avatar>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col cols="4">닉네임</v-col>
            <v-col>{{ user.targetUserInfo.name }}</v-col>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col cols="4">레벨</v-col>
            <v-col>{{ userLevel }}</v-col>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col cols="4">서명</v-col>
            <v-col>{{ userSignature || "작성된 서명이 없습니다." }}</v-col>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col cols="4">마지막 로그인</v-col>
            <v-col>{{ lastLogin }}</v-col>
          </v-row>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn block @click="user.closeUserInfo">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useUserStore } from "../../store/user"

const user = useUserStore()
const userLevel = ref<number>(0)
const lastLogin = ref<string>("2023-11-19 17:26")
const userSignature = ref<string>("")
const PREFIX = process.env.PREFIX || ""
</script>

<style scoped>
.info {
  color: #828282;
  font-size: 0.65em;
  border-left: 1px #dddddd solid;
}
</style>
