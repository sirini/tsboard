<template>
  <v-dialog v-model="manage.manageUserDialog" persistent>
    <v-card class="mx-auto" width="500" color="blue-grey">
      <v-card-title
        ><span class="title">회원 관리</span>
        <span class="manage ml-3">회원 정보를 관리합니다 (관리자 전용)</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-list>
        <alert-bar></alert-bar>
        <v-list-subheader>관리 대상 회원</v-list-subheader>
        <v-divider></v-divider>
        <v-list-item
          class="mt-2 mb-2"
          :prepend-avatar="
            PREFIX +
            (manage.targetUserInfo.profile.length < 1
              ? '/no-profile.svg'
              : manage.targetUserInfo.profile)
          "
        >
          <v-list-item-title>{{ manage.targetUserInfo.name }}</v-list-item-title>
        </v-list-item>
        <v-list-subheader>조치 항목 (체크 해제는 기능을 쓸 수 없음을 의미)</v-list-subheader>
        <v-divider></v-divider>
        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="manage.permission.writePost"
            density="compact"
            hide-details
            :label="
              manage.permission.writePost ? '글 작성을 할 수 있습니다' : '글을 쓸 수 없습니다'
            "
          ></v-checkbox>
        </v-list-item>

        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="manage.permission.writeComment"
            density="compact"
            hide-details
            :label="
              manage.permission.writeComment
                ? '댓글 작성을 할 수 있습니다'
                : '댓글을 쓸 수 없습니다'
            "
          ></v-checkbox>
        </v-list-item>

        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="manage.permission.sendNote"
            density="compact"
            hide-details
            :label="
              manage.permission.sendNote
                ? '쪽지를 다른 회원에게 보낼 수 있습니다'
                : '쪽지 기능을 쓸 수 없습니다'
            "
          ></v-checkbox>
        </v-list-item>

        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="manage.permission.sendReport"
            density="compact"
            hide-details
            :label="
              manage.permission.sendReport
                ? '다른 회원을 신고할 수 있습니다'
                : '신고 기능을 쓸 수 없습니다'
            "
          ></v-checkbox>
        </v-list-item>

        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="manage.permission.login"
            density="compact"
            hide-details
            :label="
              manage.permission.login
                ? '로그인이 가능합니다'
                : '로그인을 할 수 없습니다 (회원 자격 박탈)'
            "
          ></v-checkbox>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-subheader class="mt-2"
          >조치 사유 (운영자 및 대상 회원에게 보여집니다)</v-list-subheader
        >
        <v-list-item>
          <v-textarea
            v-model="manage.permission.response"
            :rules="rules"
            variant="outlined"
            counter
            auto-grow
          >
          </v-textarea>
        </v-list-item>
      </v-list>

      <v-card-actions class="bg-white action">
        <v-btn prepend-icon="mdi-close" @click="manage.closeManageUser"
          >아무것도 하지 않고 닫기</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="text"
          append-icon="mdi-chevron-right"
          @click="manage.manageUser"
          >조치 완료하기</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useManageUserStore } from "../../store/manageuser"
import { USER } from "../../messages/store/user"
import AlertBar from "../util/AlertBar.vue"

const manage = useManageUserStore()
const PREFIX = process.env.PREFIX || ""
const rules: any = [
  (value: string) => (value && value.length > 2 && value.length < 1000) || USER.INVALID_TEXT_LENGTH,
]
</script>

<style scoped>
.title {
  font-weight: bold;
}
.manage {
  font-size: 0.65em;
}
.action {
  border-top: #dddddd 1px solid;
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
