<template>
  <v-app class="app">
    <admin-header></admin-header>
    <v-container>
      <v-card class="mx-auto rounded-lg admin" max-width="1100">
        <v-layout>
          <v-navigation-drawer permanent location="left" width="200">
            <v-list>
              <v-list-item
                prepend-icon="mdi-clipboard-text-clock-outline"
                append-icon="mdi-chevron-right"
                @click="menu = 'waiting'"
              >
                <strong v-if="menu === 'waiting'">대기중</strong>
                <span v-else>대기중</span>
              </v-list-item>
              <v-list-item
                prepend-icon="mdi-check-circle-outline"
                append-icon="mdi-chevron-right"
                @click="menu = 'solved'"
              >
                <strong v-if="menu === 'solved'">완료됨</strong>
                <span v-else>완료됨</span>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main">
            <report-list-general v-if="menu === 'waiting'"></report-list-general>
            <report-list-solved v-if="menu === 'solved'"></report-list-solved>
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
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import ReportListGeneral from "../../components/admin/report/ReportListGeneral.vue"
import ReportListSolved from "../../components/admin/report/ReportSolvedList.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"

const admin = useAdminStore()
const menu = ref<string>("waiting")

admin.clearBreadcrumbs()
admin.addBreadcrumbs("신고 내역", `${process.env.PREFIX}/admin/report`)
</script>

<style scoped>
.app {
  background-color: #eceff1;
}
.admin {
  margin-top: 100px;
}
.main {
  min-height: 300px;
}
</style>
