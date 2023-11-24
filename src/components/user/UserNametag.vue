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
          @click="user.openUserInfo(targetUser)"
        >
          정보 보기
        </v-list-item>
        <v-list-item prepend-icon="mdi-account-filter-outline" @click="">
          글 모아 보기
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-card-account-mail-outline"
          @click="user.openSendNote(targetUser)"
          >쪽지 보내기</v-list-item
        >
        <v-list-item
          prepend-icon="mdi-account-tie-hat-outline"
          @click="user.openSendReport(targetUser)"
          >신고하기</v-list-item
        >
        <v-list-item
          prepend-icon="mdi-account-cog"
          :disabled="!auth.user.admin"
          @click="user.openManageUser(targetUser)"
          >회원 관리</v-list-item
        >
      </v-list>
    </v-menu>
  </v-chip>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "../../store/auth"
import { useUserStore } from "../../store/user"
import { TargetUserInfo } from "../../interface/user"

const auth = useAuthStore()
const user = useUserStore()
const props = defineProps<{
  uid: number
  profile: string
  name: string
  size?: string
}>()
const targetUser = ref<TargetUserInfo>({
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
