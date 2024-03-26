<template>
  <v-app-bar rounded="0" flat :color="home.color.header" class="appbar">
    <v-toolbar :color="home.color.header">
      <v-app-bar-nav-icon icon="mdi-menu" @click="home.drawer = !home.drawer"></v-app-bar-nav-icon>
      <v-app-bar-title @click="home.coming" class="title">
        <div>TSBOARD<span>.dev</span></div>
      </v-app-bar-title>

      <v-spacer v-if="home.width < 1000"></v-spacer>
      <home-header-search v-else-if="route.name === 'home'"></home-header-search>

      <v-btn icon @click="util.go('login')" v-if="auth.user.uid < 1">
        <v-icon>mdi-login-variant</v-icon>
        <v-tooltip activator="parent"> 로그인 페이지로 이동합니다. </v-tooltip>
      </v-btn>

      <v-btn icon @click="util.go('logout')" v-else>
        <v-icon>mdi-logout-variant</v-icon>
        <v-tooltip activator="parent">로그아웃 페이지로 이동합니다.</v-tooltip>
      </v-btn>

      <v-btn icon :disabled="auth.user.uid < 1">
        <v-icon>mdi-chat-outline </v-icon>
        <v-menu activator="parent">
          <v-list>
            <v-list-item
              v-for="(item, index) in chat.list"
              :key="index"
              :prepend-avatar="
                TSBOARD.PREFIX +
                (item.sender.profile.length > 0 ? item.sender.profile : '/no-profile.svg')
              "
              :title="util.unescape(item.sender.name)"
              :subtitle="util.unescape(item.message)"
              @click="chat.openDialog(item.sender)"
            >
              <template v-slot:append>
                <v-chip :color="home.color.header" class="ml-3" size="small">{{
                  util.date(item.timestamp)
                }}</v-chip>
              </template>
            </v-list-item>
            <v-list-item v-if="chat.list.length < 1" prepend-icon="mdi-check-circle">
              아직 생성된 채팅방이 없습니다.
            </v-list-item>
          </v-list>
        </v-menu>
        <v-tooltip activator="parent">나에게 온 채팅들 확인하기</v-tooltip>
      </v-btn>

      <v-btn icon @click="home.checkedAllNotifications" :disabled="auth.user.uid < 1">
        <v-badge color="error" v-if="home.haveNewNotification" dot>
          <v-icon>mdi-bell </v-icon>
        </v-badge>

        <v-icon v-else>mdi-bell-outline</v-icon>

        <v-menu activator="parent">
          <v-list>
            <v-list-item
              v-for="(noti, index) in home.notifications"
              :key="index"
              :prepend-avatar="TSBOARD.PREFIX + (noti.fromUser.profile || '/no-profile.svg')"
              @click="noti.id.length > 0 ? util.go('boardView', noti.id, noti.postUid) : ''"
            >
              {{ noti.fromUser.name }}님이 {{ home.translateNotification(noti.type) }}

              <template v-slot:append v-if="noti.type !== (NOTICE_TYPE.CHAT_MESSAGE as NoticeType)">
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>
            <v-list-item v-if="home.notifications.length < 1" prepend-icon="mdi-check-circle">
              확인이 필요한 알림이 없습니다.
            </v-list-item>
          </v-list>
        </v-menu>
        <v-tooltip activator="parent">나에게 온 알림 확인하기</v-tooltip>
      </v-btn>
    </v-toolbar>

    <chat-dialog></chat-dialog>
  </v-app-bar>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRoute } from "vue-router"
import { useAuthStore } from "../../store/user/auth"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import { useChatStore } from "../../store/user/chat"
import { NOTICE_TYPE } from "../../../server/database/board/const"
import { NoticeType } from "../../interface/home"
import { TSBOARD } from "../../../tsboard.config"
import ChatDialog from "../../components/user/ChatDialog.vue"
import HomeHeaderSearch from "./components/header/HomeHeaderSearch.vue"

const route = useRoute()
const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()
const chat = useChatStore()

onMounted(() => {
  home.loadNotification()
  chat.loadChatList()
})
</script>

<style scoped type="scss">
.appbar {
  border-bottom: #cfd8dc 1px solid;
}
.title {
  cursor: pointer;
  font-family: "Protest Strike", sans-serif;
  font-size: 1.6em;

  span {
    opacity: 0.3;
  }
}
</style>
