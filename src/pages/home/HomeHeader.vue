<template>
  <v-app-bar rounded="0" flat :color="home.color.header" class="appbar">
    <v-toolbar :color="home.color.header">
      <v-app-bar-nav-icon icon="mdi-menu" @click="home.drawer = !home.drawer"></v-app-bar-nav-icon>
      <v-app-bar-title @click="util.go('home')" class="title">
        TSBOARD<span>.dev</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="util.go('login')" v-if="auth.user.uid < 1">
        <v-icon>mdi-login-variant</v-icon>
        <v-tooltip activator="parent"> 로그인 페이지로 이동합니다. </v-tooltip>
      </v-btn>

      <v-btn icon @click="util.go('logout')" v-else>
        <v-icon>mdi-logout-variant</v-icon>
        <v-tooltip activator="parent">로그아웃 페이지로 이동합니다.</v-tooltip>
      </v-btn>

      <v-btn icon @click="home.checkedAllNotifications">
        <v-badge color="error" v-if="home.haveNewNotification" dot>
          <v-icon
            >mdi-bell
            <v-tooltip activator="parent">나에게 온 알림 확인하기</v-tooltip>
          </v-icon>
        </v-badge>

        <v-icon v-else
          >mdi-bell-outline
          <v-tooltip activator="parent">나에게 온 알림 확인하기</v-tooltip>
        </v-icon>

        <v-menu activator="parent">
          <v-list>
            <v-list-item
              v-for="(noti, index) in home.notifications"
              :key="index"
              :prepend-avatar="PREFIX + (noti.fromUser.profile || '/no-profile.svg')"
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
      </v-btn>
    </v-toolbar>
  </v-app-bar>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useAuthStore } from "../../store/user/auth"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import { NOTICE_TYPE, NoticeType } from "../../../server/database/board/const"

const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()
const PREFIX = process.env.PREFIX || ""

onMounted(() => home.loadNotification())
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
