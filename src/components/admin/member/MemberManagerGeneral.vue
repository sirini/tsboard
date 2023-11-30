<template>
  <v-card>
    <v-card-title class="myinfo_title"> {{ manager.user.name }} 님의 정보 수정하기 </v-card-title>
    <v-divider></v-divider>
    <alert-bar></alert-bar>

    <v-row no-gutters>
      <v-col>
        <v-list>
          <v-list-item>
            <v-text-field
              v-model="manager.user.id"
              variant="outlined"
              class="mt-3 mb-3"
              hide-details
              prepend-inner-icon="mdi-email-outline"
              label="회원 아이디는 변경이 불가능 합니다"
              readonly
            ></v-text-field>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-text-field
              v-model="manager.user.level"
              variant="outlined"
              class="mt-3 mb-3"
              readonly
              hide-details
              prepend-inner-icon="mdi-star-shooting-outline"
              append-inner-icon="mdi-chevron-down"
              label="사용자의 레벨을 변경하실 수 있습니다"
            >
              <v-menu activator="parent" open-on-hover>
                <v-list>
                  <v-list-item
                    v-for="(_, level) in 10"
                    :key="level"
                    @click="manager.changeUserLevel(level)"
                  >
                    {{ level }} 레벨
                    <v-chip size="small" color="info" v-if="level === 0">비회원과 동일 레벨</v-chip>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-text-field>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-textarea
              v-model="manager.user.signature"
              variant="outlined"
              class="mt-3 mb-3"
              label="회원의 서명 내용을 수정합니다 (250자 미만)"
              counter
              hide-details
              auto-grow
            ></v-textarea>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col>
        <v-list>
          <v-list-item>
            <v-text-field
              v-model="manager.user.name"
              variant="outlined"
              class="mt-3 mb-3"
              hide-details
              prepend-inner-icon="mdi-card-account-details-outline"
              label="이름 수정 후 중복 여부를 확인해 보세요"
              append-inner-icon="mdi-check-circle-outline"
              @click:append-inner="manager.checkName"
            ></v-text-field>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-text-field
              v-model="manager.user.point"
              variant="outlined"
              class="mt-3 mb-3"
              hide-details
              prepend-inner-icon="mdi-cash-100"
              label="포인트 정보를 수정합니다"
            ></v-text-field>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-text-field
              v-model="manager.password"
              class="mt-3 mb-3"
              hide-details
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              label="수정할 비밀번호를 입력해 주세요"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="visible = !visible"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model="manager.checkedPassword"
              class="mt-3 mb-3"
              hide-details
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              label="수정할 비밀번호를 한 번 더 입력해 주세요"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="visible = !visible"
            ></v-text-field>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn prepend-icon="mdi-chevron-left" @click="util.back"
        >아무것도 변경하지 않고 뒤로가기</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn color="primary" append-icon="mdi-chevron-right" @click="manager.updateUserInfo"
        >사용자 정보 업데이트 하기</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue"
import { useRoute } from "vue-router"
import { useUtilStore } from "../../../store/util"
import { useAdminMemberManagerStore } from "../../../store/admin/member/manager"
import AlertBar from "../../util/AlertBar.vue"

const route = useRoute()
const util = useUtilStore()
const manager = useAdminMemberManagerStore()
const visible = ref<boolean>(false)

watchEffect(() => {
  if (route.params?.id.length > 0) {
    const uid = parseInt(route.params?.id.toString())
    manager.loadUserInfo(uid)
  }
})
</script>
