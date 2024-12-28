<template>
  <v-app :style="bgColor" :theme="COLOR.ADMIN.THEME">
    <admin-header></admin-header>
    <v-container>
      <v-card class="mx-auto rounded-lg admin" :color="COLOR.ADMIN.MAIN" :max-width="admin.width">
        <v-card-title>회원 정보</v-card-title>
        <v-layout>
          <v-navigation-drawer permanent location="left" :width="admin.sidebarWidth">
            <v-list>
              <v-list-item prepend-icon="mdi-cog-outline" append-icon="mdi-chevron-right" @click="">
                <strong>일반</strong>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main"><user-modify></user-modify></v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useAdminStore } from "../../store/admin/common"
import { COLOR, TSBOARD } from "../../../tsboard.config"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import UserModify from "../../components/admin/user/UserModify.vue"

const route = useRoute()
const admin = useAdminStore()
const bgColor = `background-color: ${COLOR.ADMIN.BACKGROUND}`

admin.clearBreadcrumbs()
admin.addBreadcrumbs("회원 목록", `${TSBOARD.PREFIX}/admin/user`)
admin.addBreadcrumbs("회원 정보 수정", `${TSBOARD.PREFIX}/admin/user/${route.params?.id}`)
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
