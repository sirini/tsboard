<template>
  <v-app :style="bgColor" :theme="COLOR.ADMIN.THEME">
    <admin-header></admin-header>
    <v-container>
      <v-card class="mx-auto admin" :color="COLOR.ADMIN.MAIN" :max-width="admin.width" rounded="xl">
        <v-card-title>그룹들 관리</v-card-title>
        <v-layout>
          <v-navigation-drawer permanent location="left" :width="admin.sidebarWidth">
            <v-list>
              <v-list-item prepend-icon="mdi-cog-outline" append-icon="mdi-chevron-right" @click="">
                <strong>일반</strong>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main">
            <group-list-general></group-list-general>
          </v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
    <confirm-remove-group-dialog></confirm-remove-group-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { useAdminStore } from "../../store/admin/common"
import { COLOR, TSBOARD } from "../../../tsboard.config"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import GroupListGeneral from "../../components/admin/grouplist/GroupListGeneral.vue"
import ConfirmRemoveGroupDialog from "../../components/admin/grouplist/ConfirmRemoveGroupDialog.vue"

const admin = useAdminStore()

admin.clearBreadcrumbs()
admin.addBreadcrumbs("게시판 그룹 목록", `${TSBOARD.PREFIX}/admin/board`)
const bgColor = `background-color: ${COLOR.ADMIN.BACKGROUND}`
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
