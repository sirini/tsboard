<template>
  <v-app class="app">
    <admin-header></admin-header>
    <v-container>
      <v-card class="mx-auto rounded-lg admin" max-width="1100">
        <v-card-title>관리 화면에 오신 것을 환영합니다!</v-card-title>
        <v-divider></v-divider>
        <v-layout>
          <v-navigation-drawer permanent location="left" width="200">
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
            <admin-home-main v-if="menu === 'normal'"></admin-home-main>
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
import AdminHomeMain from "../../components/admin/home/AdminHomeMain.vue"

const admin = useAdminStore()
const menu = ref<"normal" | "stat">("normal")

admin.clearBreadcrumbs()
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
