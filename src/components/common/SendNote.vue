<template>
  <v-dialog v-model="auth.sendNoteDialog" persistent>
    <v-card class="mx-auto" width="500">
      <v-card-title>
        쪽지 보내기
        <span class="note ml-3 pl-3">다른 사용자에게 쪽지를 보냅니다</span>
      </v-card-title>
      <v-divider></v-divider>
      <alert-bar></alert-bar>
      <v-list>
        <v-list-subheader>받는 사람</v-list-subheader>
        <v-list-item :prepend-avatar="PREFIX + auth.targetUserInfo.profile">
          <v-list-item-title>{{ auth.targetUserInfo.name }}</v-list-item-title>
        </v-list-item>
        <v-list-subheader>보낼 내용 (1000자 이내)</v-list-subheader>
        <v-list-item>
          <v-textarea
            v-model="note"
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
          @click="auth.sendNote(auth.targetUserInfo.uid, auth.targetUserInfo.name, note)"
          >쪽지 보내기</v-btn
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
const note = ref<string>("")
const rules: any = [
  (value: string) =>
    (value && value.length > 2 && value.length < 1000) ||
    "3글자 이상, 1000자 미만으로 입력해주세요.",
]
</script>

<style scoped>
.note {
  color: #828282;
  font-size: 0.65em;
  border-left: 1px #dddddd solid;
}
</style>
