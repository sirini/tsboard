<template>
  <v-app :style="bgColor" :theme="COLOR.ADMIN.THEME">
    <admin-header></admin-header>
    <v-container>
      <v-card class="mx-auto admin" :color="COLOR.ADMIN.MAIN" :max-width="admin.width" rounded="xl">
        <v-card-title>회원 목록</v-card-title>
        <v-layout>
          <v-navigation-drawer permanent location="left" :width="admin.sidebarWidth">
            <v-list>
              <v-list-item
                prepend-icon="mdi-cog-outline"
                append-icon="mdi-chevron-right"
                @click="setBlock(false)"
              >
                <strong v-if="menu === 'general'">일반</strong>
                <span v-else>일반</span>
              </v-list-item>
              <v-list-item
                prepend-icon="mdi-account-cancel"
                append-icon="mdi-chevron-right"
                @click="setBlock(true)"
              >
                <strong v-if="menu === 'block'">차단</strong>
                <span v-else>차단</span>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main">
            <user-list></user-list>
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
import { useAdminUserStore } from "../../store/admin/user/common"
import { COLOR, TSBOARD } from "../../../tsboard.config"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import UserList from "../../components/admin/user/UserList.vue"

const admin = useAdminStore()
const user = useAdminUserStore()
const menu = ref<string>("general")
const bgColor = `background-color: ${COLOR.ADMIN.BACKGROUND}`

admin.clearBreadcrumbs()
admin.addBreadcrumbs("회원 목록", `${TSBOARD.PREFIX}/admin/member`)

// 차단 여부를 선택하기
function setBlock(isBlocked: boolean): void {
  user.isBlocked = isBlocked
  if (isBlocked) {
    menu.value = "block"
  } else {
    menu.value = "general"
  }
}
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
