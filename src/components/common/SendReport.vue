<template>
  <v-dialog v-model="auth.sendNoteDialog" persistent>
    <v-card class="mx-auto" width="500">
      <v-card-title>
        신고하기
        <span class="report ml-3 pl-3">운영진에게 신고 및 차단 기능을 사용합니다</span>
      </v-card-title>
      <v-divider></v-divider>
      <alert-bar></alert-bar>
      <v-list>
        <v-list-subheader>신고 대상자</v-list-subheader>
        <v-list-item :prepend-avatar="PREFIX + auth.targetUserInfo.profile">
          <v-list-item-title>{{ auth.targetUserInfo.name }}</v-list-item-title>
        </v-list-item>
        <v-list-subheader>차단</v-list-subheader>
        <v-list-item>
          <v-checkbox v-model="blockNote"></v-checkbox> {{ auth.targetUserInfo.name }} 님의 쪽지를
          차단합니다.
        </v-list-item>
        <v-list-item>
          <v-checkbox v-model="blockPost"></v-checkbox> {{ auth.targetUserInfo.name }} 님의 게시글이
          보이지 않도록 차단합니다.
        </v-list-item>
        <v-list-subheader>신고 내용 (1000자 이내)</v-list-subheader>
        <v-list-item>
          <v-textarea
            v-model="report"
            :rules="rules"
            variant="outlined"
            counter
            auto-grow
          ></v-textarea>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="auth.closeSendNote">취소</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="text"
          append-icon="mdi-chevron-right"
          @click="auth.sendNote(auth.targetUserInfo.uid, auth.targetUserInfo.name, report)"
          >운영진에게 신고하기</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "../../store/auth"
import AlertBar from "../util/AlertBar.vue"

const auth = useAuthStore()
const PREFIX = process.env.PREFIX || ""
const report = ref<string>("")
const rules: any = [
  (value: string) =>
    (value && value.length > 2 && value.length < 1000) ||
    "3글자 이상, 1000자 미만으로 입력해주세요.",
]
const blockNote = ref<boolean>(false)
const blockPost = ref<boolean>(false)
</script>

<style scoped>
.report {
  color: #828282;
  font-size: 0.65em;
  border-left: 1px #dddddd solid;
}
</style>
