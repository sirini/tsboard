<template>
  <v-container>
    <v-card elevation="0" rounded="0" class="mx-auto" width="500">
      <v-card-title class="signup_title"
        >회원가입
        <span class="info ml-3 pl-3">사이트에서 활용할 최소한의 정보를 요청 드립니다</span>
      </v-card-title>

      <v-list>
        <v-list-item class="pa-0">
          <v-text-field
            variant="outlined"
            class="mt-6"
            prepend-inner-icon="mdi-email-outline"
            :rules="auth.emailRule"
            label="평소 사용하시는 이메일 주소를 입력해 주세요"
            append-inner-icon="mdi-check-circle-outline"
          >
          </v-text-field>
        </v-list-item>
        <v-list-item class="pa-0">
          <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            class="mt-3"
            label="비밀번호를 입력해 주세요"
            :rules="auth.passwordRule"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
          ></v-text-field>
        </v-list-item>
        <v-list-item class="pa-0">
          <v-text-field
            variant="outlined"
            class="mt-3"
            prepend-inner-icon="mdi-card-account-details-outline"
            label="사용하실 닉네임을 입력해 주세요"
            append-inner-icon="mdi-check-circle-outline"
            :rules="auth.nicknameRule"
          ></v-text-field>
        </v-list-item>
      </v-list>

      <v-card class="mt-3 mb-3" color="surface-variant" variant="tonal">
        <v-card-text class="text-medium-emphasis text-caption">
          아이디로 사용되는 이메일 주소의 경우 로그인 뿐만 아니라 비밀번호 찾기에도 사용됩니다. 자주
          사용하는 이메일 주소를 입력해 주시고, 가급적 노출되지 않도록 부탁드립니다. 닉네임은 중복이
          허용되지 않으므로, 입력란 우측의 체크 아이콘을 클릭하여 중복 여부를 먼저 확인해 보세요.
        </v-card-text>
      </v-card>

      <v-card-actions>
        <v-btn prepend-icon="mdi-login-variant" @click="auth.goLoginPage">로그인 하기</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary"
          >가입 완료하고 로그인 하러가기 <v-icon>mdi-chevron-right</v-icon></v-btn
        >
      </v-card-actions>
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
.signup_title {
  border-bottom: 1px #828282 solid;
}

.info {
  color: #828282;
  font-size: 0.65em;
  border-left: 1px #dddddd solid;
}
</style>
