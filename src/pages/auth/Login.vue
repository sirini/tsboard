<template>
  <v-container>
    <v-card elevation="0" rounded="0" class="mx-auto" width="500">
      <v-card-title class="login_title"
        >로그인
        <span class="info ml-3 pl-3"
          >가입하실 때 등록하신 아이디(이메일) 및 비밀번호를 입력해 주세요</span
        >
      </v-card-title>

      <v-list>
        <v-list-item class="pa-0">
          <v-text-field
            variant="outlined"
            class="mt-3"
            prepend-inner-icon="mdi-email-outline"
            label="아이디(이메일 주소)를 입력해 주세요"
          ></v-text-field>
        </v-list-item>
        <v-list-item class="pa-0">
          <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            placeholder="비밀번호를 입력해 주세요"
            :rules="auth.passwordRule"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
          ></v-text-field>
        </v-list-item>

        <v-card class="mt-2 mb-6" color="surface-variant" variant="tonal">
          <v-card-text class="text-medium-emphasis text-caption">
            게시글 및 댓글 작성, 좋아요/북마크/쪽지 기능 등은 모두 로그인 후 이용 가능합니다. 로그인
            후 세션 관련 문제가 발생할 시 로그아웃 이후 다시 로그인을 부탁드립니다. 혹시 비밀번호를
            잊으셨을 경우 최초 가입 시 작성하신 아이디(이메일)로 초기화한 비밀번호를
            전해드리겠습니다.
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn prepend-icon="mdi-lock-question" @click="auth.goResetPasswordPage"
            >비밀번호 초기화</v-btn
          >
          <v-btn prepend-icon="mdi-account-plus" @click="auth.goSignUpPage">회원가입 하기</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" append-icon="mdi-chevron-right">로그인 하기</v-btn>
        </v-card-actions>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "../../store/auth"

const auth = useAuthStore()
const visible = ref<boolean>(false)
</script>

<style scoped>
.login_title {
  border-bottom: 1px #828282 solid;
}

.info {
  color: #828282;
  font-size: 0.65em;
  border-left: 1px #dddddd solid;
}
</style>
