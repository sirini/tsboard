<template>
  <v-app class="app">
    <admin-header></admin-header>
    <v-container>
      <v-card class="mx-auto rounded-lg admin" :color="admin.color" :max-width="admin.width">
        <v-card-title>최신 글 톺아보기</v-card-title>
        <v-layout>
          <v-navigation-drawer permanent location="left" :width="admin.sidebarWidth">
            <v-list>
              <v-list-item prepend-icon="mdi-cog-outline" append-icon="mdi-chevron-right">
                <strong>일반</strong>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main">
            <latest-post-general></latest-post-general>
          </v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useAdminStore } from "../../store/admin/common"
import { TSBOARD } from "../../../tsboard.config"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import LatestPostGeneral from "../../components/admin/latest/LatestPostGeneral.vue"

const admin = useAdminStore()

admin.clearBreadcrumbs()
admin.addBreadcrumbs("최신 글", `${TSBOARD.PREFIX}/admin/latest/post`)
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
  background-color: white;
}
</style>
