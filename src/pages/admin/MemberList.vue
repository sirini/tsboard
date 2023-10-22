<template>
  <v-app>
    <admin-header></admin-header>
    <v-layout class="layout">
      <v-main>
        <v-container>
          <v-card> Member list :: 회원 목록 출력, 관리 기능 사용</v-card>
        </v-container>
        <admin-footer></admin-footer>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useAdminStore } from "../../store/admin"
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
