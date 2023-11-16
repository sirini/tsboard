<template>
  <v-app class="app">
    <admin-header></admin-header>
    <v-card class="mx-auto rounded-lg admin" width="1200">
      <v-card-title>관리 화면에 오신 것을 환영합니다!</v-card-title>
      <v-divider></v-divider>
      <v-layout>
        <v-navigation-drawer permanent location="left" width="250">
          <v-list>
            <v-list-item
              prepend-icon="mdi-cog-outline"
              append-icon="mdi-chevron-right"
              @click="menu = 'normal'"
            >
              <strong v-if="menu === 'normal'">일반</strong>
              <span v-else>일반</span>
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-chart-areaspline"
              append-icon="mdi-chevron-right"
              @click="menu = 'stat'"
            >
              <strong v-if="menu === 'stat'">통계</strong>
              <span v-else>통계</span>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-main class="main">
          <admin-home-main v-if="menu === 'normal'"></admin-home-main>
          <admin-home-stat v-if="menu === 'stat'"></admin-home-stat>
        </v-main>
      </v-layout>
    </v-card>
    <admin-footer></admin-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAdminStore } from "../../store/admin/common"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import AdminHomeMain from "../../components/admin/home/AdminHomeMain.vue"
import AdminHomeStat from "../../components/admin/home/AdminHomeStat.vue"

const admin = useAdminStore()
const menu = ref<"normal" | "stat">("normal")

admin.setBreadcrumbs()
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
