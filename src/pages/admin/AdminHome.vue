<template>
  <v-app>
    <admin-header></admin-header>
    <v-container class="admin">
      <v-card class="mx-auto rounded-lg" variant="outlined">
        <v-card-title>관리 화면에 오신 것을 환영합니다!</v-card-title>
        <v-divider></v-divider>
        <v-layout>
          <v-navigation-drawer permanent location="left" width="250">
            <v-list>
              <v-list-item
                prepend-icon="mdi-monitor-dashboard"
                append-icon="mdi-chevron-right"
                @click="menu = 'main'"
              >
                <strong v-if="menu === 'main'">메인</strong>
                <span v-else>메인</span>
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
            <admin-home-main v-if="menu === 'main'"></admin-home-main>
            <admin-home-stat v-if="menu === 'stat'"></admin-home-stat>
          </v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import AdminHomeMain from "../../components/admin/home/AdminHomeMain.vue"
import AdminHomeStat from "../../components/admin/home/AdminHomeStat.vue"

const menu = ref<"main" | "stat">("main")
</script>

<style scoped>
.admin {
  margin-top: 64px;
}

.main {
  min-height: 300px;
}
</style>
