<template>
  <v-dialog v-model="manage.manageUserDialog" persistent>
    <v-card class="mx-auto" :max-width="home.dialogWidth" :color="COLOR.HOME.HEADER">
      <v-card-title
        ><span>{{ TEXT[home.lang].TITLE }}</span>
        <span class="manage ml-3">{{ TEXT[home.lang].INFO }}</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-list>
        <alert-bar></alert-bar>
        <v-list-subheader>{{ TEXT[home.lang].TARGET }}</v-list-subheader>
        <v-divider></v-divider>
        <v-list-item
          class="mt-2 mb-2"
          :prepend-avatar="TSBOARD.PREFIX + (manage.targetUser.profile || '/no-profile.svg')"
        >
          <v-list-item-title>{{ manage.targetUser.name }}</v-list-item-title>
        </v-list-item>

        <v-list-subheader class="mt-3">{{ TEXT[home.lang].ACTION }}</v-list-subheader>
        <v-divider></v-divider>
        <v-alert
          :color="COLOR.HOME.HEADER"
          variant="tonal"
          icon="mdi-information"
          class="text-caption"
          :text="TEXT[home.lang].ACTION_INFO"
        ></v-alert>

        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="manage.permission.writePost"
            density="compact"
            hide-details
            :label="
              manage.permission.writePost ? TEXT[home.lang].WRITE_OK : TEXT[home.lang].WRITE_NO
            "
          ></v-checkbox>
        </v-list-item>

        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="manage.permission.writeComment"
            density="compact"
            hide-details
            :label="
              manage.permission.writeComment
                ? TEXT[home.lang].COMMENT_OK
                : TEXT[home.lang].COMMENT_NO
            "
          ></v-checkbox>
        </v-list-item>

        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="manage.permission.sendChatMessage"
            density="compact"
            hide-details
            :label="
              manage.permission.sendChatMessage ? TEXT[home.lang].CHAT_OK : TEXT[home.lang].CHAT_NO
            "
          ></v-checkbox>
        </v-list-item>

        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="manage.permission.sendReport"
            density="compact"
            hide-details
            :label="
              manage.permission.sendReport ? TEXT[home.lang].REPORT_OK : TEXT[home.lang].REPORT_NO
            "
          ></v-checkbox>
        </v-list-item>

        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="manage.permission.login"
            density="compact"
            hide-details
            :label="manage.permission.login ? TEXT[home.lang].LOGIN_OK : TEXT[home.lang].LOGIN_NO"
          ></v-checkbox>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-subheader class="mt-2">{{ TEXT[home.lang].ACTION_REASON }}</v-list-subheader>
        <v-list-item>
          <v-textarea
            v-model="manage.permission.response"
            :rules="rules"
            variant="outlined"
            counter
            auto-grow
          >
          </v-textarea>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="manage.closeManageUser">{{
          TEXT[home.lang].CLOSE
        }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn append-icon="mdi-chevron-right" @click="manage.manageUser">{{
          TEXT[home.lang].SUBMIT
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { COLOR, TSBOARD } from "../../../tsboard.config"
import { TEXT } from "../../messages/components/board/user/manage-user-dialog"
import { useHomeStore } from "../../store/home"
import { useManageUserStore } from "../../store/user/manageuser"
import AlertBar from "../util/AlertBar.vue"

const home = useHomeStore()
const manage = useManageUserStore()
const rules: any = [
  (value: string) =>
    (value && value.length > 2 && value.length < 1000) || TEXT[home.lang].TOO_SHORT_REASON,
]
</script>

<style scoped>
.manage {
  color: #78909c;
  font-size: 0.65em;
}

/** 다이얼로그 배경 조정 */
.v-overlay--active {
  animation: tsboardCustomOverlay 0.5s ease-in forwards;
}
@keyframes tsboardCustomOverlay {
  from {
    backdrop-filter: blur(0px);
    background: rgba(0, 0, 0, 0);
  }
  to {
    backdrop-filter: blur(2px);
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
