<template>
  <v-dialog v-model="chat.dialog" persistent>
    <v-card class="mx-auto" width="500" :color="home.color.header">
      <v-card-title>
        <span>채팅</span>
        <span class="note ml-3 pl-3">다른 사용자에게 채팅 메시지를 보냅니다</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="wrap pa-0" id="tsboardChatHistory">
        <v-list>
          <alert-bar></alert-bar>
          <v-list-subheader>받는 사람</v-list-subheader>
          <v-list-item
            :prepend-avatar="TSBOARD.PREFIX + (chat.targetUser.profile || '/no-profile.svg')"
          >
            <v-list-item-title>{{ chat.targetUser.name }}</v-list-item-title>
          </v-list-item>

          <v-list-subheader>이전 쪽지 내역</v-list-subheader>
          <v-divider></v-divider>

          <v-list-item v-for="(msg, index) in chat.history" :key="index" class="mt-2 mb-2">
            <template v-slot:prepend v-if="msg.userUid === chat.targetUser.uid">
              <v-avatar>
                <v-img
                  :src="TSBOARD.PREFIX + (chat.targetUser.profile || '/no-profile.svg')"
                ></v-img>
              </v-avatar>
            </template>

            <v-card
              variant="tonal"
              :color="msg.userUid === auth.user.uid ? 'primary' : 'blue-grey'"
            >
              <v-card-text>{{ util.unescape(msg.message) }}</v-card-text>
            </v-card>

            <template v-slot:append v-if="msg.userUid === auth.user.uid">
              <v-avatar>
                <v-img :src="TSBOARD.PREFIX + (auth.user.profile || '/no-profile.svg')"></v-img>
              </v-avatar>
            </template>
          </v-list-item>
          <v-divider id="tsboardEndOfChat"></v-divider>
        </v-list>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-close" class="mr-2" @click="chat.closeDialog">닫기</v-btn>
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
  --sb-size: 5px;

  scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);
}
#tsboardChatHistory::-webkit-scrollbar {
  width: var(--sb-size);
}

#tsboardChatHistory::-webkit-scrollbar-track {
  background: var(--sb-track-color);
  border-radius: 5px;
}

#tsboardChatHistory::-webkit-scrollbar-thumb {
  background: var(--sb-thumb-color);
  border-radius: 5px;
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
    backdrop-filter: blur(5px);
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
