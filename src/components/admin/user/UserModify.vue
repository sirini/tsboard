<template>
  <v-card>
    <v-card-title
      ><v-avatar size="100" class="mt-2 mb-2 mr-3"
        ><v-img
          :src="
            TSBOARD.PREFIX +
            (userModify.user.profile.length < 1 ? '/no-profile.svg' : userModify.user.profile)
          "
        ></v-img
      ></v-avatar>
      {{ userModify.user.name }} 님의 정보 수정하기
    </v-card-title>
    <v-divider></v-divider>
    <alert-bar></alert-bar>

    <v-row no-gutters>
      <v-col>
        <v-list>
          <v-list-item>
            <v-text-field
              v-model="userModify.user.id"
              variant="outlined"
              class="mt-2 mb-3"
              hide-details
              prepend-inner-icon="mdi-email-outline"
              label="회원 아이디는 변경이 불가능 합니다"
              readonly
            ></v-text-field>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-text-field
              v-model="userModify.user.level"
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
                    @click="userModify.changeUserLevel(level)"
                  >
                    {{ level }} 레벨
                    <v-chip size="small" color="warning" v-if="level === 0"
                      >비회원과 동일 레벨</v-chip
                    >
                    <v-chip size="small" color="info" v-if="level === 9"
                      >최고 관리자와 동일 레벨</v-chip
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-text-field>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-textarea
              v-model="userModify.user.signature"
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
              v-model="userModify.user.name"
              variant="outlined"
              class="mt-2 mb-3"
              hide-details
              prepend-inner-icon="mdi-card-account-details-outline"
              label="이름 수정 후 중복 여부를 확인해 보세요"
              append-inner-icon="mdi-check-circle-outline"
              @click:append-inner="userModify.checkName"
            ></v-text-field>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-text-field
              v-model="userModify.user.point"
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
              v-model="userModify.password"
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
              v-model="userModify.checkedPassword"
              class="mt-5 mb-3"
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
    <v-row no-gutters>
      <v-col>
        <v-list>
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar v-if="userModify.newProfilePreview.length > 0">
                <v-img :src="userModify.newProfilePreview"></v-img>
              </v-avatar>
            </template>

            <v-file-input
              variant="outlined"
              hide-details
              class="mt-2 mb-2"
              prepend-icon="mdi-camera"
              accept="image/*"
              label="프로필 사진을 선택해 보세요"
              @change="userModify.selectProfileImage"
            ></v-file-input>
          </v-list-item> </v-list
      ></v-col>
    </v-row>
    <v-divider></v-divider>

    <v-card-actions>
      <v-btn prepend-icon="mdi-chevron-left" @click="util.back"
        >아무것도 변경하지 않고 뒤로가기</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn color="primary" append-icon="mdi-chevron-right" @click="userModify.updateUserInfo"
        >사용자 정보 업데이트 하기</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useUtilStore } from "../../../store/util"
import { useAdminUserModifyStore } from "../../../store/admin/user/modify"
import { TSBOARD } from "../../../../tsboard.config"
import AlertBar from "../../util/AlertBar.vue"

const route = useRoute()
const util = useUtilStore()
const userModify = useAdminUserModifyStore()
const visible = ref<boolean>(false)

// 멤버 고유 번호가 파라미터로 넘어오면 회원 정보 가져오기
onMounted(() => {
  const userUid = parseInt(route.params.no as string)
  userModify.loadUserInfo(userUid)
})
</script>
