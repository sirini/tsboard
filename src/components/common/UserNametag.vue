<template>
  <v-chip class="pointer" :size="size || 'small'">
    <v-avatar start>
      <v-img :src="profile"></v-img>
    </v-avatar>
    {{ name }}

    <v-menu activator="parent">
      <v-list density="compact">
        <v-list-item
          prepend-icon="mdi-card-account-details-outline"
          @click="auth.userInfoDialog = true"
        >
          정보 보기
        </v-list-item>
        <v-list-item prepend-icon="mdi-account-filter-outline" @click="">
          글 모아 보기
        </v-list-item>
        <v-list-item prepend-icon="mdi-card-account-mail-outline" @click=""
          >쪽지 보내기</v-list-item
        >
        <v-list-item prepend-icon="mdi-account-tie-hat-outline" @click="">신고하기</v-list-item>
        <v-list-item prepend-icon="mdi-account-cog" :disabled="!auth.user.admin" @click=""
          >회원 관리</v-list-item
        >
      </v-list>
    </v-menu>
  </v-chip>
  <user-info :uid="uid" :profile="profile" :name="name"></user-info>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../store/auth"
import UserInfo from "./UserInfo.vue"

const auth = useAuthStore()
const props = defineProps<{
  uid: number
  profile: string
  name: string
  size?: string
}>()
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
