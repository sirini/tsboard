<template>
  <v-btn icon :disabled="auth.user.uid < 1">
    <v-icon>mdi-chat-outline</v-icon>
    <v-menu activator="parent">
      <v-list>
        <v-list-item
          v-for="(item, index) in chat.list"
          :key="index"
          :prepend-avatar="TSBOARD.PREFIX + (item.sender.profile || '/no-profile.svg')"
          :title="util.unescape(item.sender.name)"
          :subtitle="util.unescape(item.message)"
          @click="chat.openDialog(item.sender)"
        >
          <template v-slot:append>
            <v-chip :color="COLOR.HOME.HEADER" class="ml-3" size="small">{{
              util.date(item.timestamp)
            }}</v-chip>
          </template>
        </v-list-item>
        <v-list-item v-if="chat.list.length < 1" prepend-icon="mdi-check-circle">
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
import { COLOR, TSBOARD } from "../../../../../tsboard.config"
import { TEXT } from "../../../../messages/pages/home/components/header/home-header-chat"

const home = useHomeStore()
const auth = useAuthStore()
const util = useUtilStore()
const chat = useChatStore()

onMounted(() => chat.loadChatList())
</script>
