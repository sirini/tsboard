<template>
  <v-chip class="pointer" :size="size || 'small'" color="blue-grey">
    <v-avatar start>
      <v-img :src="PREFIX + (profile.length < 1 ? '/no-profile.svg' : profile)"></v-img>
    </v-avatar>
    {{ util.unescape(name) }}

    <v-menu activator="parent">
      <v-list density="compact">
        <v-list-item
          prepend-icon="mdi-card-account-details-outline"
          @click="
            user.openDialog({
              uid,
              name,
              profile,
            })
          "
        >
          정보 보기
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-card-account-mail-outline"
          v-if="auth.user.uid > 0 && auth.user.uid !== uid"
          @click="
            chat.openDialog({
              uid,
              name,
              profile,
            })
          "
          >채팅 보내기</v-list-item
        >
        <v-list-item
          prepend-icon="mdi-account-tie-hat-outline"
          @click="
            report.openDialog({
              uid,
              name,
              profile,
            })
          "
          v-if="auth.user.uid > 0 && auth.user.uid !== uid"
          >신고하기</v-list-item
        >
        <v-list-item
          prepend-icon="mdi-account-cog"
          :disabled="!auth.user.admin"
          @click="
            manage.openManageUser({
              uid,
              name,
              profile,
            })
          "
          v-if="auth.user.uid === 1"
          >회원 관리</v-list-item
        >
      </v-list>
    </v-menu>
  </v-chip>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../store/user/auth"
import { useUserStore } from "../../store/user/user"
import { useReportStore } from "../../store/user/report"
import { useChatStore } from "../../store/user/chat"
import { useManageUserStore } from "../../store/user/manageuser"
import { useUtilStore } from "../../store/util"

const auth = useAuthStore()
const user = useUserStore()
const report = useReportStore()
const chat = useChatStore()
const manage = useManageUserStore()
const util = useUtilStore()
const props = defineProps<{
  uid: number
  profile: string
  name: string
  size?: string
}>()
const PREFIX = process.env.PREFIX || ""
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
