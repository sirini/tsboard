<template>
  <v-btn icon @click="home.checkedAllNotifications" :disabled="auth.user.uid < 1">
    <v-badge color="error" v-if="auth.user.uid > 0 && home.haveNewNotification" dot>
      <v-icon>mdi-bell</v-icon>
    </v-badge>

    <v-icon v-else>mdi-bell-outline</v-icon>

    <v-menu activator="parent">
      <v-list>
        <v-list-item
          v-for="(noti, index) in home.notifications"
          :key="index"
          :prepend-avatar="TSBOARD.PREFIX + (noti.fromUser.profile || '/no-profile.svg')"
          @click="actionForNoti(noti)"
        >
          {{ util.unescape(noti.fromUser.name) }} {{ home.translateNotification(noti.type) }}

          <template v-slot:append v-if="noti.type !== (NOTICE_TYPE.CHAT_MESSAGE as NoticeType)">
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-list-item>
        <v-list-item v-if="home.notifications.length < 1" prepend-icon="mdi-check-circle">
          {{ TEXT[home.lang].EMPTY }}
        </v-list-item>
      </v-list>
    </v-menu>
    <v-tooltip activator="parent">{{ TEXT[home.lang].TOOLTIP }}</v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { NavigationFailure } from "vue-router"
import { NOTICE_TYPE } from "../../../../../server/database/board/const"
import { TSBOARD } from "../../../../../tsboard.config"
import { NoticeType, TsboardNotification } from "../../../../interface/home"
import { TEXT } from "../../../../messages/pages/home/components/header/home-header-notification"
import { useHomeStore } from "../../../../store/home"
import { useAuthStore } from "../../../../store/user/auth"
import { useChatStore } from "../../../../store/user/chat"
import { useUtilStore } from "../../../../store/util"

const home = useHomeStore()
const auth = useAuthStore()
const util = useUtilStore()
const chat = useChatStore()

// 노티 클릭 시 행동 지정하기
async function actionForNoti(
  noti: TsboardNotification,
): Promise<NavigationFailure | void | undefined> {
  if (noti.type === NOTICE_TYPE.CHAT_MESSAGE) {
    return chat.openDialog(noti.fromUser)
  }

  if (noti.id.length > 0) {
    return util.go(noti.boardType, noti.id, noti.postUid)
  }
}

onMounted(() => home.loadNotification())
</script>
