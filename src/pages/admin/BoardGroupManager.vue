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
        <v-card-title>{{ general.group.id }} 그룹 관리</v-card-title>
        <v-divider></v-divider>
        <v-layout>
          <v-navigation-drawer permanent location="left" width="250">
            <v-list>
              <v-list-item
                prepend-icon="mdi-cog-outline"
                append-icon="mdi-chevron-right"
                @click="admin.menu = MENU.GROUP.GENERAL"
              >
                <strong v-if="admin.menu === MENU.GROUP.GENERAL">일반</strong>
                <span v-else>일반</span>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main">
            <board-group-general v-if="admin.menu === MENU.GROUP.GENERAL"></board-group-general>
          </v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
  </v-app>
</template>

<script setup lang="ts">
import { watchEffect } from "vue"
import { useRoute } from "vue-router"
import { useAdminStore, MENU } from "../../store/admin/common"
import { useAdminGroupGeneralStore } from "../../store/admin/group/general"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import BoardGroupGeneral from "../../components/admin/group/BoardGroupGeneral.vue"

const route = useRoute()
const admin = useAdminStore()
const general = useAdminGroupGeneralStore()
const PREFIX = process.env.PREFIX || ""
const breadcrumbs = [
  {
    title: "Admin",
    disabled: false,
    href: PREFIX + "/admin",
  },
  {
    title: "Board Group List",
    disabled: false,
    href: PREFIX + "/admin/board",
  },
  {
    title: general.group.id,
    disabled: true,
    href: PREFIX + "/admin/board/group/" + general.group.id,
  },
]

watchEffect(() => {
  if (route.params?.id.length > 1) {
    general.group.id = route.params?.id.toString()
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
