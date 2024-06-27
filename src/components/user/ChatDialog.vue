<template>
  <v-dialog v-model="chat.dialog" persistent>
    <v-card class="mx-auto" :width="home.dialogWidth" :color="home.color.header">
      <v-card-title>
        <span>{{ TEXT[home.lang].TITLE }}</span>
        <span class="note ml-3 pl-3">{{ TEXT[home.lang].INFO }}</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="wrap pa-0" id="tsboardChatHistory">
        <v-list>
          <alert-bar></alert-bar>
          <v-list-subheader>{{ TEXT[home.lang].RECEIVER }}</v-list-subheader>
          <v-divider></v-divider>
          <v-list-item
            :prepend-avatar="TSBOARD.PREFIX + (chat.targetUser.profile || '/no-profile.svg')"
          >
            <v-list-item-title>{{ chat.targetUser.name }}</v-list-item-title>
          </v-list-item>

          <v-list-subheader class="mt-3">{{ TEXT[home.lang].CHAT_HISTORY }}</v-list-subheader>
          <v-divider></v-divider>

          <v-list-item v-for="(msg, index) in chat.history" :key="index" class="mt-2 mb-2">
            <template v-slot:prepend>
              <v-avatar>
                <v-img
                  v-if="msg.userUid === chat.targetUser.uid"
                  :src="TSBOARD.PREFIX + (chat.targetUser.profile || '/no-profile.svg')"
                ></v-img>
              </v-avatar>

              <v-card
                v-if="msg.userUid !== auth.user.uid"
                :max-width="Math.floor(home.dialogWidth * 0.5)"
                variant="tonal"
                rounded="xl"
                color="blue-grey"
                class="ml-3"
              >
                <v-card-text>{{ util.unescape(msg.message) }}</v-card-text>
              </v-card>
            </template>

            <template v-slot:append>
              <v-card
                v-if="msg.userUid === auth.user.uid"
                :max-width="Math.floor(home.dialogWidth * 0.5)"
                variant="tonal"
                rounded="xl"
                color="primary"
                class="mr-3"
              >
                <v-card-text>{{ util.unescape(msg.message) }}</v-card-text>
              </v-card>

              <v-avatar>
                <v-img
                  v-if="msg.userUid === auth.user.uid"
                  :src="TSBOARD.PREFIX + (auth.user.profile || '/no-profile.svg')"
                ></v-img>
              </v-avatar>
            </template>
          </v-list-item>
          <v-divider id="tsboardEndOfChat"></v-divider>
        </v-list>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-close" class="mr-2" @click="chat.closeDialog">{{
          TEXT[home.lang].CLOSE
        }}</v-btn>
        <v-text-field
          v-model="chat.message"
          density="compact"
          append-inner-icon="mdi-send"
          variant="outlined"
          hide-details
          @keyup.enter="chat.send"
          @click:append-inner="chat.send"
        >
        </v-text-field>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch } from "vue"
import { useAuthStore } from "../../store/user/auth"
import { useChatStore } from "../../store/user/chat"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import { TSBOARD } from "../../../tsboard.config"
import AlertBar from "../util/AlertBar.vue"
import { TEXT } from "../../messages/components/board/user/chat-dialog"

const auth = useAuthStore()
const chat = useChatStore()
const home = useHomeStore()
const util = useUtilStore()

// 채팅 히스토리가 업데이트 될 때마다 스크롤을 밑으로 이동
const delayForScroll = 250
watch(
  () => chat.history.length,
  () => {
    setTimeout(() => {
      const eos = document.querySelector("#tsboardEndOfChat") as HTMLDivElement
      eos?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    }, delayForScroll)
  },
)
</script>

<style scoped>
#tsboardChatHistory {
  --sb-track-color: #eceff1;
  --sb-thumb-color: #546e7a;
  --sb-size: 3px;

  scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);
}
#tsboardChatHistory::-webkit-scrollbar {
  width: var(--sb-size);
}

#tsboardChatHistory::-webkit-scrollbar-track {
  background: var(--sb-track-color);
}

#tsboardChatHistory::-webkit-scrollbar-thumb {
  background: var(--sb-thumb-color);
}
.note {
  color: #78909c;
  font-size: 0.65em;
}
.wrap {
  overflow-y: scroll;
}

/** 다이얼로그 배경 조정 */
.v-overlay--active {
  animation: tsboardCustomOverlay 0.5s ease-in forwards;
}
@keyframes tsboardCustomOverlay {
  from {
    backdrop-filter: blur(0px);
    background: rgba(0, 0, 0, 0);
  }
  to {
    backdrop-filter: blur(2px);
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
