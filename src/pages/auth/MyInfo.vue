<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card elevation="0" rounded="0" class="mx-auto" max-width="500">
            <v-card-title class="myinfo_title">
              내 정보
              <span class="info ml-3 pl-3">내 정보를 확인하고 필요시 수정합니다</span>
            </v-card-title>

            <alert-bar></alert-bar>

            <v-list>
              <v-list-item class="pa-0 text-center">
                <v-chip
                  size="x-large"
                  color="blue-grey"
                  class="mt-3 mb-3"
                  :prepend-avatar="
                    PREFIX + (auth.user.profile.length < 1 ? '/no-profile.svg' : auth.user.profile)
                  "
                >
                  {{ auth.user.id }}
                  <v-divider vertical class="ml-2 mr-2"></v-divider>
                  <v-icon>mdi-alpha-l</v-icon> {{ auth.user.level }}
                  <v-divider vertical class="ml-2 mr-2"></v-divider>
                  <v-icon>mdi-alpha-p</v-icon> {{ auth.user.point }}
                  <v-tooltip activator="parent"
                    >아이디(이메일)는 다른 회원에게 보여주지 마세요.</v-tooltip
                  >
                </v-chip>
              </v-list-item>

              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.name"
                  variant="outlined"
                  class="mt-3 ml-3 mr-3"
                  :rules="auth.nameRule"
                  prepend-inner-icon="mdi-card-account-details-outline"
                  label="수정할 닉네임을 입력하신 후 중복 여부를 확인해 보세요"
                  append-inner-icon="mdi-check-circle-outline"
                  @click:append-inner="signup.checkName"
                ></v-text-field>
              </v-list-item>

              <v-list-item class="pa-0">
                <v-file-input
                  variant="outlined"
                  hide-details
                  class="mt-1 mb-3 ml-3 mr-3"
                  prepend-icon="mdi-camera"
                  accept="image/*"
                  label="프로필 사진을 선택해 보세요"
                  @change="auth.selectProfileImage"
                ></v-file-input>
              </v-list-item>

              <v-list-item class="pa-0">
                <v-textarea
                  v-model="auth.user.signature"
                  variant="outlined"
                  class="mt-3 ml-3 mr-3"
                  label="나의 서명입니다 (~250자)"
                  counter
                  auto-grow
                ></v-textarea>
              </v-list-item>

              <v-list-item class="pa-0">
                <template v-slot:prepend>
                  <div class="ml-3">
                    <v-icon class="mr-2">mdi-account-check-outline</v-icon>
                    {{ util.date(auth.user.signup) }} 가입
                  </div>
                </template>
                <template v-slot:append>
                  <div class="mr-3">
                    <v-icon class="mr-2">mdi-login-variant</v-icon>
                    {{ util.date(auth.user.signin) }} 마지막 로그인
                  </div>
                </template>
              </v-list-item>

              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.password"
                  class="mt-3 ml-3 mr-3"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  placeholder="수정할 비밀번호를 입력해 주세요"
                  :rules="auth.passwordRule"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                ></v-text-field>
              </v-list-item>

              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.checkedPassword"
                  class="mt-3 ml-3 mr-3"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  placeholder="수정할 비밀번호를 한 번 더 입력해 주세요"
                  :rules="auth.passwordRule"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                ></v-text-field>
              </v-list-item>
            </v-list>

            <v-card-actions class="mt-3">
              <v-btn prepend-icon="mdi-chevron-left" @click="util.back">뒤로가기</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" append-icon="mdi-chevron-right" @click="auth.updateMyInfo"
                >변경 사항 저장하기</v-btn
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
const PREFIX = process.env.PREFIX || ""

const visible = ref<boolean>(false)
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.myinfo_title {
  border-bottom: 1px #828282 solid;
}
.info {
  color: #828282;
  font-size: 0.65em;
  border-left: 1px #dddddd solid;
}
</style>
