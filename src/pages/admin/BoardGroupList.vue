<template>
  <v-app>
    <admin-header></admin-header>
    <v-container class="admin">
      <v-card class="mx-auto rounded-lg" variant="outlined">
        <v-card-title>그룹들 관리</v-card-title>
        <v-divider></v-divider>
        <v-layout>
          <v-navigation-drawer permanent location="left" width="250">
            <v-list>
              <v-list-item
                prepend-icon="mdi-cog-outline"
                append-icon="mdi-chevron-right"
                @click="admin.menu = MENU.GROUPLIST.GENERAL"
              >
                <strong v-if="admin.menu === MENU.GROUPLIST.GENERAL">일반</strong>
                <span v-else>일반</span>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main">
            <group-list-general v-if="admin.menu === MENU.GROUPLIST.GENERAL"></group-list-general>
          </v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
  </v-app>
</template>

<script setup lang="ts">
import { watchEffect } from "vue"
import { useAdminStore, MENU } from "../../store/admin/common"
import { useAdminGroupListStore } from "../../store/admin/group/list"
import { AdminBreadcrumb } from "../../interface/admin"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import GroupListGeneral from "../../components/admin/grouplist/GroupListGeneral.vue"

const admin = useAdminStore()
const list = useAdminGroupListStore()

const level1: AdminBreadcrumb = {
  title: `게시판 그룹 목록`,
  disabled: false,
  href: `${process.env.PREFIX}/admin/board`,
}

admin.setBreadcrumbs(level1)

watchEffect(() => {
  if (admin.menu !== MENU.GROUPLIST.GENERAL) {
    admin.menu = MENU.GROUPLIST.GENERAL
  }
})
</script>

<style scoped>
.admin {
  margin-top: 64px;
}

.main {
  min-height: 300px;
}
</style>
