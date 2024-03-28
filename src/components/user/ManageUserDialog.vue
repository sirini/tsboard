<template>
  <v-dialog v-model="manage.manageUserDialog" persistent>
    <v-card class="mx-auto" :max-width="home.dialogWidth" :color="home.color.header">
      <v-card-title
        ><span>회원 관리</span>
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
            TSBOARD.PREFIX +
            (manage.targetUser.profile.length < 1 ? '/no-profile.svg' : manage.targetUser.profile)
          "
        >
          <v-list-item-title>{{ manage.targetUser.name }}</v-list-item-title>
        </v-list-item>

        <v-list-subheader class="mt-3">조치 항목</v-list-subheader>
        <v-divider></v-divider>
        <v-alert
          color="blue-grey"
          variant="tonal"
          icon="mdi-information"
          class="text-caption"
          text="체크 해제된 항목은 해당 기능을 사용할 수 없음을 의미합니다."
        ></v-alert>

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
            v-model="manage.permission.sendChatMessage"
            density="compact"
            hide-details
            :label="
              manage.permission.sendChatMessage
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
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="manage.closeManageUser">그냥 닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn append-icon="mdi-chevron-right" @click="manage.manageUser">조치 완료하기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../store/home"
import { useManageUserStore } from "../../store/user/manageuser"
import { USER } from "../../messages/store/user/user"
import { TSBOARD } from "../../../tsboard.config"
import AlertBar from "../util/AlertBar.vue"

const home = useHomeStore()
const manage = useManageUserStore()
const rules: any = [
  (value: string) => (value && value.length > 2 && value.length < 1000) || USER.INVALID_TEXT_LENGTH,
]
</script>

<style scoped>
.manage {
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
