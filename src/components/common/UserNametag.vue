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
          @click="auth.openUserInfo(user)"
        >
          정보 보기
        </v-list-item>
        <v-list-item prepend-icon="mdi-account-filter-outline" @click="">
          글 모아 보기
        </v-list-item>
        <v-list-item prepend-icon="mdi-card-account-mail-outline" @click=""
          >쪽지 보내기</v-list-item
        >
        <v-list-item prepend-icon="mdi-account-tie-hat-outline" @click="auth.openSendReport(user)"
          >신고하기</v-list-item
        >
        <v-list-item
          prepend-icon="mdi-account-cog"
          :disabled="!auth.user.admin"
          @click="auth.openSendReport(user)"
          >회원 관리</v-list-item
        >
      </v-list>
    </v-menu>
  </v-chip>
  <user-info></user-info>
  <send-note></send-note>
  <send-report></send-report>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "../../store/auth"
import { TargetUserInfo } from "../../interface/auth"
import UserInfo from "./UserInfo.vue"
import SendNote from "./SendNote.vue"
import SendReport from "./SendReport.vue"

const auth = useAuthStore()
const props = defineProps<{
  uid: number
  profile: string
  name: string
  size?: string
}>()
const user = ref<TargetUserInfo>({
  uid: props.uid,
  profile: props.profile,
  name: props.name,
})
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
