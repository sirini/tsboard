<template>
  <v-app>
    <admin-header></admin-header>
    <v-container class="admin">
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <v-icon icon="mdi-chevron-right"></v-icon>
        </template>
      </v-breadcrumbs>
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
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import GroupListGeneral from "../../components/admin/grouplist/GroupListGeneral.vue"

const admin = useAdminStore()
const list = useAdminGroupListStore()
const PREFIX = process.env.PREFIX || ""
const breadcrumbs = [
  {
    title: "Admin",
    disabled: false,
    href: PREFIX + "/admin",
  },
  {
    title: "Group List",
    disabled: true,
    href: PREFIX + "/admin/board",
  },
]

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
