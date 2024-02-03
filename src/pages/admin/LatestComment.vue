<template>
  <v-app class="app">
    <admin-header></admin-header>
    <v-container>
      <v-card class="mx-auto rounded-lg admin">
        <v-layout>
          <v-navigation-drawer permanent location="left" width="200">
            <v-list>
              <v-list-item prepend-icon="mdi-cog-outline" append-icon="mdi-chevron-right">
                <strong>일반</strong>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main">
            <latest-comment-general></latest-comment-general>
          </v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useAdminStore } from "../../store/admin/common"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import LatestCommentGeneral from "../../components/admin/latest/LatestCommentGeneral.vue"

const admin = useAdminStore()

admin.clearBreadcrumbs()
admin.addBreadcrumbs("최신 댓글", `${process.env.PREFIX}/admin/latest/comment`)
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
