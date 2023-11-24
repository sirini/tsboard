<template>
  <v-app class="app">
    <admin-header></admin-header>
    <v-card class="mx-auto rounded-lg admin" width="1200">
      <v-card-title>그룹들 관리</v-card-title>
      <v-divider></v-divider>
      <v-layout>
        <v-navigation-drawer permanent location="left" width="250">
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
    <admin-footer></admin-footer>
    <confirm-remove-group-dialog></confirm-remove-group-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { useAdminStore } from "../../store/admin/common"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import GroupListGeneral from "../../components/admin/grouplist/GroupListGeneral.vue"
import ConfirmRemoveGroupDialog from "../../components/admin/grouplist/ConfirmRemoveGroupDialog.vue"

const admin = useAdminStore()

admin.clearBreadcrumbs()
admin.addBreadcrumbs("게시판 그룹 목록", `${process.env.PREFIX}/admin/board`)
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
