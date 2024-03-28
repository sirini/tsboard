<template>
  <v-app class="app">
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card
            rounded="lg"
            class="mx-auto"
            :max-width="home.dialogWidth"
            :color="home.color.header"
            :loading="signup.loading"
          >
            <v-card-title
              >회원가입
              <span class="info ml-3 pl-3">환영합니다!</span>
            </v-card-title>
            <v-divider></v-divider>

            <v-list><alert-bar></alert-bar></v-list>
            <v-list class="pl-6 pr-6">
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.id"
                  variant="outlined"
                  class="mt-6"
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

              <v-card class="mt-2 mb-6" variant="tonal" color="blue-grey">
                <v-card-text class="text-medium-emphasis text-caption">
                  아이디로 사용되는 이메일 주소의 경우 로그인 뿐만 아니라 비밀번호 찾기에도
                  사용됩니다. 자주 사용하는 이메일 주소를 입력해 주시고, 노출되지 않도록
                  부탁드립니다. 닉네임은 입력란 우측의 체크 아이콘을 클릭하여 중복 여부를 먼저
                  확인해 보세요. 양식 제출 후 입력하신 이메일에서 인증 메일을 확인해 주시고, 혹시
                  없을 경우 스팸 처리되었는지 살펴봐주세요!
                </v-card-text>
              </v-card>
            </v-list>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn prepend-icon="mdi-login-variant" @click="util.go('login')">로그인 하기</v-btn>
              <v-spacer></v-spacer>
              <v-btn append-icon="mdi-chevron-right" @click="signup.submit"
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
import { useHomeStore } from "../../store/home"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import AlertBar from "../../components/util/AlertBar.vue"

const auth = useAuthStore()
const signup = useSignupStore()
const util = useUtilStore()
const home = useHomeStore()
const visible = ref<boolean>(false)
</script>

<style scoped>
.app {
  background-color: #eceff1;
}
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.info {
  color: #cfd8dc;
  font-size: 0.7em;
}
</style>
