<template>
  <v-app>
    <admin-header></admin-header>
    <v-layout class="layout">
      <v-main>
        <v-container>
          <v-card>
            Board group manager / 게시판(갤러리) 그룹 목록과 각 그룹별 게시판(갤러리) 목록들 출력 및
            관리</v-card
          >
        </v-container>
        <admin-footer></admin-footer>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useAdminStore } from "../../store/admin/common"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"

const route = useRoute()
const admin = useAdminStore()
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
</style>
