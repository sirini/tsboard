<template>
  <v-dialog v-model="user.manageUserDialog" persistent>
    <v-card class="mx-auto" width="500" color="blue-grey-lighten-5">
      <v-card-title
        ><span class="title">회원 관리</span>
        <span class="manage ml-3 pl-3">회원 정보를 관리합니다 (관리자 전용)</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-list>
        <alert-bar></alert-bar>
        <v-list-subheader>대상 회원</v-list-subheader>
        <v-list-item :prepend-avatar="PREFIX + user.targetUserInfo.profile">
          <v-list-item-title>{{ user.targetUserInfo.name }}</v-list-item-title>
        </v-list-item>
        <v-list-subheader>조치 항목</v-list-subheader>
        <v-divider></v-divider>
        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="block.writePost"
            density="compact"
            hide-details
            :label="user.targetUserInfo.name + '님이 글 작성을 할 수 없도록 합니다'"
          ></v-checkbox>
        </v-list-item>

        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="block.writeComment"
            density="compact"
            hide-details
            :label="user.targetUserInfo.name + '님이 댓글 작성을 할 수 없도록 합니다'"
          ></v-checkbox>
        </v-list-item>

        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="block.note"
            density="compact"
            hide-details
            :label="user.targetUserInfo.name + '님이 쪽지 기능을 쓰지 못하게 합니다'"
          ></v-checkbox>
        </v-list-item>

        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="block.report"
            density="compact"
            hide-details
            :label="user.targetUserInfo.name + '님이 다른 회원을 신고하지 못하게 합니다'"
          ></v-checkbox>
        </v-list-item>

        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="block.login"
            density="compact"
            hide-details
            :label="
              user.targetUserInfo.name + '님이 로그인 하지 못하게 차단합니다 (회원 자격 상실)'
            "
          ></v-checkbox>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-subheader>조치 사유 (운영자 및 대상 회원에게 보여집니다)</v-list-subheader>
        <v-list-item>
          <v-textarea v-model="report" :rules="rules" variant="outlined" counter auto-grow>
          </v-textarea>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="user.closeManageUser">닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="text"
          append-icon="mdi-chevron-right"
          @click="user.manageUser(block, report)"
          >조치 완료하기</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useUserStore } from "../../store/user"
import { BlockFeature } from "../../interface/user"
import AlertBar from "../util/AlertBar.vue"

const user = useUserStore()
const PREFIX = process.env.PREFIX || ""
const block = ref<BlockFeature>({
  writePost: false,
  writeComment: false,
  note: false,
  report: false,
  login: false,
})
const report = ref<string>("")
const rules: any = [
  (value: string) =>
    (value && value.length > 2 && value.length < 1000) ||
    "3글자 이상, 1000자 미만으로 입력해주세요.",
]
</script>

<style scoped>
.title {
  color: #37474f;
}
.manage {
  color: #78909c;
  font-size: 0.65em;
  border-left: 1px #cfd8dc solid;
}
</style>
