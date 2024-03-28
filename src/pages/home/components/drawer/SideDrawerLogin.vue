<template>
  <v-list>
    <v-list-subheader>로그인</v-list-subheader>
    <v-list-item>
      <alert-bar class="mb-2"></alert-bar>

      <v-card elevation="0" rounded="0">
        <v-text-field
          v-model="auth.user.id"
          variant="outlined"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-card-account-details-outline"
        ></v-text-field>

        <v-text-field
          v-model="auth.password"
          variant="outlined"
          density="compact"
          hide-details
          class="mt-2"
          :type="visible ? 'text' : 'password'"
          :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
          prepend-inner-icon="mdi-lock-outline"
          @click:append-inner="visible = !visible"
          @keyup.enter="auth.login"
        ></v-text-field>

        <v-card-actions>
          <v-btn rounded="xl" @click="util.go('resetpassword')">비번 찾기</v-btn>
          <v-spacer></v-spacer>
          <v-btn rounded="xl" append-icon="mdi-chevron-right" color="primary" @click="auth.login"
            >로그인</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "../../../../store/user/auth"
import { useHomeStore } from "../../../../store/home"
import { useUtilStore } from "../../../../store/util"
import AlertBar from "../../../../components/util/AlertBar.vue"

const auth = useAuthStore()
const home = useHomeStore()
const util = useUtilStore()
const visible = ref<boolean>(false)
</script>
