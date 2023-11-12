<template>
  <v-app-bar flat rounded="0">
    <v-app-bar-nav-icon icon="mdi-cog-outline" @click="router.push({ name: 'admin' })">
    </v-app-bar-nav-icon>

    <v-breadcrumbs :items="breadcrumb">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue"
import { useRouter } from "vue-router"
import { useAdminStore } from "../../../store/admin/common"
import { AdminBreadcrumb } from "../../../interface/admin"

const router = useRouter()
const admin = useAdminStore()
const breadcrumb = ref<AdminBreadcrumb[]>([])

watchEffect(() => {
  if (admin.breadcrumbLevel1 || admin.breadcrumbLevel2 || admin.breadcrumbLevel3) {
    breadcrumb.value = []
  }
  if (admin.breadcrumbLevel1) breadcrumb.value.push(admin.breadcrumbLevel1)
  if (admin.breadcrumbLevel2) breadcrumb.value.push(admin.breadcrumbLevel2)
  if (admin.breadcrumbLevel3) breadcrumb.value.push(admin.breadcrumbLevel3)
})
</script>

<style scoped>
.logo {
  font-family: "Grandiflora One", cursive;
  font-size: 1.3em;
  cursor: pointer;
  font-weight: bold;
}
.firstTopButton {
  margin-left: 20px;
}
</style>
