<template>
  <v-app>
    <admin-header></admin-header>
    <v-layout class="layout">
      <v-main>
        <v-container>
          <v-card> ADMIN DASHBOARD </v-card>
          <admin-footer></admin-footer>
        </v-container>
      </v-main>
    </v-layout>
    <confirm-remove-category-dialog></confirm-remove-category-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useAdminStore } from "../../store/admin"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import confirmRemoveCategoryDialog from "../../components/admin/board/ConfirmRemoveCategoryDialog.vue"

const route = useRoute()
const admin = useAdminStore()
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
</style>
