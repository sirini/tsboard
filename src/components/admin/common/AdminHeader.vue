<template>
  <v-app-bar flat rounded="0" color="blue-grey-lighten-5">
    <v-container>
      <v-toolbar>
        <v-btn icon @click="router.push({ name: 'home' })"
          ><v-icon>mdi-home</v-icon>
          <v-tooltip activator="parent">클릭하시면 웹사이트 홈 화면으로 이동합니다</v-tooltip>
        </v-btn>

        <v-btn icon @click="router.push({ name: 'admin' })"
          ><v-icon>mdi-cog-outline</v-icon>
          <v-tooltip activator="parent">클릭하시면 관리화면 첫 페이지로 이동합니다</v-tooltip>
        </v-btn>

        <v-breadcrumbs :items="breadcrumb">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>

        <v-spacer></v-spacer>

        <v-icon color="blue-grey-lighten-4">mdi-alpha-t-box</v-icon>
        <v-icon color="blue-grey-lighten-4">mdi-alpha-s-box</v-icon>
        <v-icon color="blue-grey-lighten-4">mdi-alpha-a-box-outline</v-icon>
        <v-icon color="blue-grey-lighten-4">mdi-alpha-d-box-outline</v-icon>
        <v-icon color="blue-grey-lighten-4">mdi-alpha-m-box-outline</v-icon>
        <v-icon color="blue-grey-lighten-4">mdi-alpha-i-box-outline</v-icon>
        <v-icon color="blue-grey-lighten-4">mdi-alpha-n-box-outline</v-icon>
      </v-toolbar>
    </v-container>
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
