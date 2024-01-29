<template>
  <v-dialog v-model="user.sendReportDialog" persistent>
    <v-card class="mx-auto" width="500" color="blue-grey-lighten-5">
      <v-card-title>
        <span class="title">신고하기</span>
        <span class="report ml-3 pl-3">운영진에게 신고 및 차단 기능을 사용합니다</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-list>
        <alert-bar></alert-bar>
        <v-list-subheader>신고 대상자</v-list-subheader>
        <v-list-item :prepend-avatar="PREFIX + user.targetUserInfo.profile">
          <v-list-item-title>{{ user.targetUserInfo.name }}</v-list-item-title>
        </v-list-item>
        <v-list-subheader>차단</v-list-subheader>

        <v-divider></v-divider>
        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="blockNote"
            density="compact"
            hide-details
            :label="user.targetUserInfo.name + '님이 보내는 쪽지를 차단 합니다'"
          ></v-checkbox>
        </v-list-item>

        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="blockPost"
            density="compact"
            hide-details
            :label="user.targetUserInfo.name + '님의 게시글이 보이지 않도록 차단 합니다'"
          ></v-checkbox>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-subheader>신고 내용 (1000자 이내)</v-list-subheader>
        <v-list-item>
          <v-textarea
            v-model="report"
            :rules="rules"
            variant="outlined"
            counter
            auto-grow
            hide-details
          ></v-textarea>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="user.closeSendReport">닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="text"
          append-icon="mdi-chevron-right"
          @click="user.sendReport(report, blockNote, blockPost)"
          >운영진에게 신고하기</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useUserStore } from "../../store/user"
import AlertBar from "../util/AlertBar.vue"

const user = useUserStore()
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
.title {
  color: #37474f;
}
.report {
  color: #78909c;
  font-size: 0.65em;
  border-left: 1px #cfd8dc solid;
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
