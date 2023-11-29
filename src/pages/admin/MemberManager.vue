<template>
  <v-app class="app">
    <admin-header></admin-header>
    <v-container>
      <v-card class="mx-auto rounded-lg admin" max-width="1100">
        <v-layout>
          <v-navigation-drawer permanent location="left" width="200">
            <v-list>
              <v-list-item prepend-icon="mdi-cog-outline" append-icon="mdi-chevron-right" @click="">
                <strong>일반</strong>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main"><member-manager-general></member-manager-general></v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useAdminStore } from "../../store/admin/common"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import MemberManagerGeneral from "../../components/admin/member/MemberManagerGeneral.vue"

const route = useRoute()
const admin = useAdminStore()

admin.clearBreadcrumbs()
admin.addBreadcrumbs("회원 목록", `${process.env.PREFIX}/admin/member`)
admin.addBreadcrumbs("회원 정보 수정", `${process.env.PREFIX}/admin/member/${route.params?.id}`)
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
