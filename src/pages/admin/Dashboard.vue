<template>
  <v-app :style="bgColor" :theme="COLOR.ADMIN.THEME">
    <admin-header></admin-header>
    <v-container>
      <v-card class="mx-auto rounded-lg mt-16" :color="COLOR.ADMIN.MAIN" :max-width="admin.width">
        <v-card-title>대시보드</v-card-title>
        <v-layout>
          <v-navigation-drawer permanent location="left" :width="admin.sidebarWidth">
            <v-list>
              <v-list-item
                prepend-icon="mdi-cog-outline"
                append-icon="mdi-chevron-right"
                @click="menu = 'normal'"
              >
                <strong v-if="menu === 'normal'">일반</strong>
                <span v-else>일반</span>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main">
            <dashboard-general v-if="menu === 'normal'"></dashboard-general>
          </v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAdminStore } from "../../store/admin/common"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import DashboardGeneral from "../../components/admin/dashboard/DashboardGeneral.vue"
import { COLOR } from "../../../tsboard.config"

const admin = useAdminStore()
const menu = ref<"normal" | "stat">("normal")
const bgColor = `background-color: ${COLOR.ADMIN.BACKGROUND}`

admin.clearBreadcrumbs()
</script>

<style scoped>
.main {
  min-height: 300px;
  background-color: white;
}
</style>
