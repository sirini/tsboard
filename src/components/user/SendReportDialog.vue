<template>
  <v-dialog v-model="report.dialog" persistent>
    <v-card class="mx-auto" :max-width="home.dialogWidth" :color="home.color.header">
      <v-card-title>
        <span>{{ TEXT[home.lang].TITLE }}</span>
        <span class="report ml-3 pl-3">{{ TEXT[home.lang].INFO }}</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-list>
        <alert-bar></alert-bar>
        <v-list-subheader>{{ TEXT[home.lang].TARGET }}</v-list-subheader>
        <v-divider></v-divider>
        <v-list-item
          :prepend-avatar="report.targetUser.profile || `${TSBOARD.PREFIX}/no-profile.svg`"
        >
          <v-list-item-title>{{ report.targetUser.name }}</v-list-item-title>
        </v-list-item>

        <v-list-subheader class="mt-3">{{ TEXT[home.lang].BLACKLIST }}</v-list-subheader>

        <v-divider></v-divider>
        <v-list-item class="pa-0">
          <v-alert
            variant="tonal"
            color="blue-grey"
            icon="mdi-information"
            class="text-caption"
            :text="TEXT[home.lang].BLACKLIST_INFO"
          ></v-alert>
        </v-list-item>
        <v-list-item class="pa-0 pl-3">
          <v-checkbox
            v-model="report.checkedBlackList"
            density="compact"
            hide-details
            :label="TEXT[home.lang].ADD_BLACKLIST + report.targetUser.name"
          ></v-checkbox>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-subheader>{{ TEXT[home.lang].REPORT_CONTENT }}</v-list-subheader>
        <v-list-item>
          <v-textarea
            v-model="report.content"
            :rules="rules"
            variant="outlined"
            counter
            auto-grow
            hide-details
          ></v-textarea>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="report.closeDialog">{{
          TEXT[home.lang].CLOSE
        }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn append-icon="mdi-chevron-right" @click="report.sendReport">{{
          TEXT[home.lang].SUBMIT
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useReportStore } from "../../store/user/report"
import { useHomeStore } from "../../store/home"
import { TSBOARD } from "../../../tsboard.config"
import AlertBar from "../util/AlertBar.vue"
import { TEXT } from "../../messages/components/board/user/send-report-dialog"

const report = useReportStore()
const home = useHomeStore()
const rules: any = [
  (value: string) =>
    (value && value.length > 2 && value.length < 1000) ||
    "3글자 이상, 1000자 미만으로 입력해주세요.",
]
</script>

<style scoped>
.report {
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
