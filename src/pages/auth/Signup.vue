<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card
            elevation="0"
            rounded="0"
            class="mx-auto"
            max-width="500"
            :loading="signup.loading"
          >
            <v-card-title class="signup_title"
              >회원가입
              <span class="info ml-3 pl-3">사이트에서 활용할 최소한의 정보를 요청 드립니다</span>
            </v-card-title>

            <alert-bar></alert-bar>

            <v-list>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.id"
                  variant="outlined"
                  class="mt-3"
                  prepend-inner-icon="mdi-email-outline"
                  :rules="auth.emailRule"
                  label="평소 사용하시는 이메일 주소를 입력해 주세요"
                  append-inner-icon="mdi-check-circle-outline"
                  @click:append-inner="signup.checkEmail"
                  @blur="signup.checkEmail"
                >
                </v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.password"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  class="mt-2"
                  label="비밀번호를 입력해 주세요"
                  :rules="auth.passwordRule"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                ></v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.checkedPassword"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  class="mt-2"
                  label="비밀번호를 한 번 더 입력해 주세요"
                  :rules="auth.passwordRule"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                ></v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.name"
                  variant="outlined"
                  class="mt-2"
                  prepend-inner-icon="mdi-card-account-details-outline"
                  label="사이트 내에서 사용하실 이름을 입력해 주세요"
                  append-inner-icon="mdi-check-circle-outline"
                  @click:append-inner="signup.checkName"
                  :rules="auth.nameRule"
                ></v-text-field>
              </v-list-item>
            </v-list>

            <v-card class="mt-2 mb-3" color="surface-variant" variant="tonal">
              <v-card-text class="text-medium-emphasis text-caption">
                아이디로 사용되는 이메일 주소의 경우 로그인 뿐만 아니라 비밀번호 찾기에도
                사용됩니다. 자주 사용하는 이메일 주소를 입력해 주시고, 노출되지 않도록 부탁드립니다.
                닉네임은 입력란 우측의 체크 아이콘을 클릭하여 중복 여부를 먼저 확인해 보세요. 양식
                제출 후 입력하신 이메일에서 인증 메일을 확인해 주시고, 혹시 없을 경우 스팸
                처리되었는지 살펴봐주세요!
              </v-card-text>
            </v-card>
            <v-card-actions>
              <v-btn prepend-icon="mdi-login-variant" @click="util.go('login')">로그인 하기</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" append-icon="mdi-chevron-right" @click="signup.submit"
                >가입 신청서 제출하기</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "../../store/user/auth"
import { useSignupStore } from "../../store/user/signup"
import { useUtilStore } from "../../store/util"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import AlertBar from "../../components/util/AlertBar.vue"

const auth = useAuthStore()
const signup = useSignupStore()
const util = useUtilStore()
const visible = ref<boolean>(false)
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.signup_title {
  border-bottom: 1px #828282 solid;
}
.info {
  color: #828282;
  font-size: 0.65em;
  border-left: 1px #dddddd solid;
}
</style>
