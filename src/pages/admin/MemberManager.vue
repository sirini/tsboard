<template>
  <v-app class="app">
    <admin-header></admin-header>
    <v-card class="mx-auto rounded-lg admin" width="1200">
      <v-layout>
        <v-navigation-drawer permanent location="left" width="250">
          <v-list>
            <v-list-item prepend-icon="mdi-cog-outline" append-icon="mdi-chevron-right" @click="">
              <strong>일반</strong>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-main class="main"><member-manager-general></member-manager-general></v-main>
      </v-layout>
    </v-card>
    <admin-footer></admin-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useAdminStore } from "../../store/admin/common"
import { AdminBreadcrumb } from "../../interface/admin"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import MemberManagerGeneral from "../../components/admin/member/MemberManagerGeneral.vue"

const route = useRoute()
const admin = useAdminStore()
const level1: AdminBreadcrumb = {
  title: `회원 목록`,
  disabled: false,
  href: `${process.env.PREFIX}/admin/member`,
}
const level2: AdminBreadcrumb = {
  title: `회원 정보 수정`,
  disabled: false,
  href: `${process.env.PREFIX}/admin/member/${route.params?.id}`,
}
admin.setBreadcrumbs(level1, level2)
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
