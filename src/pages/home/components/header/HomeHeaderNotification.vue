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
          :prepend-avatar="noti.fromUser.profile || `${TSBOARD.PREFIX}/no-profile.svg`"
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
import { useHomeStore } from "../../../../store/home"
import { useAuthStore } from "../../../../store/user/auth"
import { useUtilStore } from "../../../../store/util"
import { useChatStore } from "../../../../store/user/chat"
import { ACTION_TARGET, NOTICE_TYPE } from "../../../../../server/database/board/const"
import { NoticeType, TsboardNotification } from "../../../../interface/home"
import { TSBOARD } from "../../../../../tsboard.config"
import { TEXT } from "../../../../messages/pages/home/components/header/home-header-notification"
import { BoardType } from "../../../../interface/board"

const home = useHomeStore()
const auth = useAuthStore()
const util = useUtilStore()
const chat = useChatStore()

// 노티 클릭 시 행동 지정하기
function actionForNoti(noti: TsboardNotification): void {
  if (noti.type === NOTICE_TYPE.CHAT_MESSAGE) {
    return chat.openDialog(noti.fromUser)
  }

  if (noti.id.length > 0) {
    return util.go(
      util.routerName(noti.type as BoardType, ACTION_TARGET.VIEW),
      noti.id,
      noti.postUid,
    )
  }
}

onMounted(() => home.loadNotification())
</script>
