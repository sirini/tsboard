<template>
  <v-navigation-drawer
    v-model="home.notiDrawer"
    :width="home.sidebarWidth"
    temporary
    location="right"
  >
    <v-list>
      <v-list-subheader>Notification</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item
        lines="two"
        v-for="(noti, index) in home.notifications"
        :key="index"
        :prepend-avatar="TSBOARD.PREFIX + (noti.fromUser.profile || '/no-profile.svg')"
        @click="home.actionForNoti(noti)"
        class="text-caption"
      >
        <strong>{{ util.unescape(noti.fromUser.name) }}</strong>
        {{ home.translateNotification(noti.type) }}
      </v-list-item>
      <v-list-item
        v-if="home.notifications.length < 1"
        prepend-icon="mdi-check-circle"
        class="text-caption"
      >
        {{ TEXT[home.lang].EMPTY }}
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item v-if="home.notifications.length > 0" class="text-center mt-3">
        <v-btn
          rounded="pill"
          @click="home.checkedAllNotifications"
          variant="tonal"
          :color="COLOR.HOME.MAIN"
          >{{ TEXT[home.lang].CHECKED }}</v-btn
        >
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { COLOR, TSBOARD } from "../../../tsboard.config"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import { TEXT } from "../../messages/pages/home/components/header/home-header-notification"

const home = useHomeStore()
const util = useUtilStore()

onMounted(() => home.loadNotification())
</script>
