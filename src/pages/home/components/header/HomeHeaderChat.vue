<template>
  <v-btn icon :disabled="auth.user.uid < 1">
    <v-icon>mdi-chat-outline</v-icon>
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
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useHomeStore } from "../../../../store/home"
import { useAuthStore } from "../../../../store/user/auth"
import { useUtilStore } from "../../../../store/util"
import { useChatStore } from "../../../../store/user/chat"
import { TSBOARD } from "../../../../../tsboard.config"

const home = useHomeStore()
const auth = useAuthStore()
const util = useUtilStore()
const chat = useChatStore()

onMounted(() => chat.loadChatList())
</script>
