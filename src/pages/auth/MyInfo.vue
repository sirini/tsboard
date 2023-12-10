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
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.id"
                  variant="outlined"
                  class="mt-3"
                  prepend-inner-icon="mdi-email-outline"
                  label="아이디는 외부로 노출하지 않는 걸 권장합니다"
                  readonly
                ></v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.name"
                  variant="outlined"
                  class="mt-3"
                  :rules="auth.nameRule"
                  prepend-inner-icon="mdi-card-account-details-outline"
                  label="수정할 닉네임을 입력하신 후 중복 여부를 확인해 보세요"
                  append-inner-icon="mdi-check-circle-outline"
                  @click:append-inner="auth.checkName"
                ></v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.level"
                  variant="outlined"
                  class="mt-3"
                  prepend-inner-icon="mdi-star-shooting-outline"
                  label="현재 레벨입니다"
                  readonly
                ></v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.point"
                  variant="outlined"
                  class="mt-3"
                  prepend-inner-icon="mdi-cash-100"
                  label="현재 보유중인 포인트입니다"
                  readonly
                ></v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-textarea
                  v-model="auth.user.signature"
                  variant="outlined"
                  class="mt-3"
                  label="나의 서명입니다 (~250자)"
                  counter
                  auto-grow
                ></v-textarea>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.signup"
                  variant="outlined"
                  class="mt-3"
                  label="최초 가입일입니다."
                  readonly
                ></v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.user.signin"
                  variant="outlined"
                  class="mt-3"
                  label="마지막으로 로그안 한 시간입니다"
                  readonly
                ></v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-text-field
                  v-model="auth.password"
                  class="mt-3"
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
                  class="mt-3"
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
            <v-card-actions>
              <v-btn prepend-icon="mdi-chevron-left" @click="util.back"
                >변경 취소하고 뒤로가기</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn color="primary" append-icon="mdi-chevron-right" @click="auth.saveMyInfo"
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
import { useAuthStore } from "../../store/auth"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import AlertBar from "../../components/util/AlertBar.vue"

const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()
const visible = ref<boolean>(false)
home.color = "blue-grey-lighten-5"
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
