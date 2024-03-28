<template>
  <v-dialog v-model="report.dialog" persistent>
    <v-card class="mx-auto" :max-width="home.dialogWidth" :color="home.color.header">
      <v-card-title>
        <span>신고하기</span>
        <span class="report ml-3 pl-3">신고 및 차단 기능을 사용합니다</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-list>
        <alert-bar></alert-bar>
        <v-list-subheader>신고 대상자</v-list-subheader>
        <v-divider></v-divider>
        <v-list-item
          :prepend-avatar="TSBOARD.PREFIX + (report.targetUser.profile || '/no-profile.svg')"
        >
          <v-list-item-title>{{ report.targetUser.name }}</v-list-item-title>
        </v-list-item>

        <v-list-subheader class="mt-3">블랙리스트</v-list-subheader>

        <v-divider></v-divider>
        <v-list-item class="pa-0">
          <v-alert
            variant="tonal"
            color="blue-grey"
            icon="mdi-information"
            class="text-caption"
            text="내 블랙리스트에 추가된 회원은 나에게 채팅 메시지를 보낼 수 없으며, 내가 작성한 게시글을 열람할 수 없습니다."
          ></v-alert>
        </v-list-item>
        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="report.checkedBlackList"
            density="compact"
            hide-details
            :label="report.targetUser.name + '님을 나의 블랙랙리스트에 추가합니다.'"
          ></v-checkbox>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-subheader>신고 내용 (1000자 이내)</v-list-subheader>
        <v-list-item>
          <v-textarea
            v-model="report.content"
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
        <v-btn prepend-icon="mdi-close" @click="report.closeDialog">닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn append-icon="mdi-chevron-right" @click="report.sendReport"
          >운영진에게 신고하기</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useReportStore } from "../../store/user/report"
import { useHomeStore } from "../../store/home"
import { TSBOARD } from "../../../tsboard.config"
import AlertBar from "../util/AlertBar.vue"

const report = useReportStore()
const home = useHomeStore()
const rules: any = [
  (value: string) =>
    (value && value.length > 2 && value.length < 1000) ||
    "3글자 이상, 1000자 미만으로 입력해주세요.",
]
</script>

<style scoped>
.report {
  color: #78909c;
  font-size: 0.65em;
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
