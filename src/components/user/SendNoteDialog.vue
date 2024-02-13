<template>
  <v-dialog v-model="user.sendNoteDialog" persistent>
    <v-card class="mx-auto" width="500" :color="home.color.header">
      <v-card-title>
        <span class="title">쪽지 보내기</span>
        <span class="note ml-3 pl-3">다른 사용자에게 쪽지를 보냅니다</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="wrap pa-0" id="tsboardChatHistory">
        <alert-bar></alert-bar>

        <v-list>
          <v-list-subheader>받는 사람</v-list-subheader>
          <v-list-item :prepend-avatar="PREFIX + user.targetUserInfo.profile">
            <v-list-item-title>{{ user.targetUserInfo.name }}</v-list-item-title>
          </v-list-item>

          <v-list-subheader>이전 쪽지 내역</v-list-subheader>
          <v-divider></v-divider>

          <v-list-item v-for="(chat, index) in user.chatHistory" :key="index" class="mt-2 mb-2">
            <template v-slot:prepend v-if="chat.userUid === user.targetUserInfo.uid">
              <v-avatar>
                <v-img :src="PREFIX + user.targetUserInfo.profile"></v-img>
              </v-avatar>
            </template>
            <v-card
              variant="tonal"
              :color="chat.userUid === auth.user.uid ? 'primary' : 'blue-grey'"
            >
              <v-card-text>{{ chat.message }}</v-card-text>
            </v-card>
            <template v-slot:append v-if="chat.userUid === auth.user.uid">
              <v-avatar>
                <v-img :src="PREFIX + auth.user.profile"></v-img>
              </v-avatar>
            </template>
          </v-list-item>
          <v-divider id="tsboardEndOfChat"></v-divider>
        </v-list>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-text-field
          v-model="user.chatMessage"
          :rules="rules"
          hide-details
          density="compact"
          append-inner-icon="mdi-send"
          variant="outlined"
          @keyup.enter="user.sendNote"
          @click:append-inner="user.sendNote"
        >
        </v-text-field>
        <v-btn prepend-icon="mdi-close" class="ml-2" @click="user.closeSendNote">닫기 </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, watch } from "vue"
import { useAuthStore } from "../../store/auth"
import { useUserStore } from "../../store/user"
import { useHomeStore } from "../../store/home"
import AlertBar from "../util/AlertBar.vue"

const auth = useAuthStore()
const user = useUserStore()
const home = useHomeStore()
const PREFIX = process.env.PREFIX || ""
const rules: any = [
  (value: string) =>
    (value && value.length > 1 && value.length < 100) || "2글자 이상, 100자 미만으로 입력해주세요.",
]

// 채팅 히스토리가 업데이트 될 때마다 스크롤을 밑으로 이동
const delayForScroll = 250
watch(
  () => user.chatHistory.length,
  () => {
    setTimeout(() => {
      const eos = document.querySelector("#tsboardEndOfChat") as HTMLDivElement
      eos?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    }, delayForScroll)
  },
)

// for test
onBeforeMount(() => {
  user.chatHistory = []
  user.chatHistory.push({
    userUid: 11,
    message: "이 글은 예시용 쪽지 내용입니다. 상대방의 쪽지를 가정합니다.",
  })
  user.chatHistory.push({
    userUid: 1,
    message: "상대방의 쪽지 내용에 내가 답글을 남긴 모습입니다.",
  })
  user.chatHistory.push({
    userUid: 11,
    message: "상대방의 쪽지 내용으로 마무리 됩니다.",
  })
})
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
.title {
  color: #37474f;
}
.note {
  color: #78909c;
  font-size: 0.65em;
  border-left: 1px #cfd8dc solid;
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
