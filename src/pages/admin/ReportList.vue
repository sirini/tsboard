<template>
  <v-app :style="bgColor" :theme="COLOR.ADMIN.THEME">
    <admin-header></admin-header>
    <v-container>
      <v-card class="mx-auto rounded-lg admin" :color="COLOR.ADMIN.MAIN" :max-width="admin.width">
        <v-card-title>신고 목록</v-card-title>
        <v-layout>
          <v-navigation-drawer permanent location="left" :width="admin.sidebarWidth">
            <v-list>
              <v-list-item
                prepend-icon="mdi-clipboard-text-clock-outline"
                append-icon="mdi-chevron-right"
                @click="setSolvedOption(false)"
              >
                <strong v-if="menu === 'waiting'">대기중</strong>
                <span v-else>대기중</span>
              </v-list-item>
              <v-list-item
                prepend-icon="mdi-check-circle-outline"
                append-icon="mdi-chevron-right"
                @click="setSolvedOption(true)"
              >
                <strong v-if="menu === 'solved'">완료됨</strong>
                <span v-else>완료됨</span>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main">
            <report-list></report-list>
          </v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
    <manage-user-dialog></manage-user-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAdminStore } from "../../store/admin/common"
import { useAdminReportStore } from "../../store/admin/report/common"
import { COLOR, TSBOARD } from "../../../tsboard.config"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import ReportList from "../../components/admin/report/ReportList.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"

const admin = useAdminStore()
const report = useAdminReportStore()
const menu = ref<string>("waiting")
const bgColor = `background-color: ${COLOR.ADMIN.BACKGROUND}`

admin.clearBreadcrumbs()
admin.addBreadcrumbs("신고 내역", `${TSBOARD.PREFIX}/admin/report`)

// 해결된 신고 건인지 아닌지 구분하기
function setSolvedOption(isSolved: boolean): void {
  report.isSolved = isSolved
  if (isSolved) {
    menu.value = "solved"
  } else {
    menu.value = "waiting"
  }
  report.page = 1
}
</script>

<style scoped>
.admin {
  margin-top: 100px;
}
.main {
  min-height: 300px;
  background-color: white;
}
</style>
