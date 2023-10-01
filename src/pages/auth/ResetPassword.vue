<template>
  <v-container>
    <v-card elevation="0" rounded="0" class="mx-auto" width="500">
      <v-card-title class="find_password_title">
        비밀번호 찾기
        <span class="info ml-3 pl-3"
          >비밀번호를 잊어버리셨나요? 이곳에서 초기화 하실 수 있습니다</span
        >
      </v-card-title>

      <v-list>
        <v-list-item class="pa-0">
          <v-text-field
            variant="outlined"
            class="mt-6"
            prepend-inner-icon="mdi-email-outline"
            :rules="auth.emailRule"
            label="본인 아이디(이메일 주소)를 입력해 주세요"
          ></v-text-field>
        </v-list-item>
      </v-list>

      <v-card class="mb-3" color="surface-variant" variant="tonal">
        <v-card-text class="text-medium-emphasis text-caption">
          최초 가입 시점에 입력하신 이메일 주소로 초기화된 비밀번호를 발송해 드립니다. 사이트
          내에서는 상대방의 아이디(이메일 주소)를 볼 수 없도록 되어 있지만, 혹시 노출된 경우 다른
          사용자가 임의로 초기화 할 수 있사오니 주의를 부탁드립니다.
        </v-card-text>
      </v-card>

      <v-card-actions>
        <v-btn prepend-icon="mdi-login-variant" @click="auth.goLoginPage">로그인 하러가기</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary">비밀번호 초기화 하기 <v-icon>mdi-chevron-right</v-icon></v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../store/auth"

const auth = useAuthStore()
</script>

<style scoped>
.find_password_title {
  border-bottom: 1px #828282 solid;
}

.info {
  color: #828282;
  font-size: 0.65em;
  border-left: 1px #dddddd solid;
}
</style>
