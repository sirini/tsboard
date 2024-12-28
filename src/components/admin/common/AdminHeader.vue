<template>
  <v-app-bar flat rounded="0" :color="COLOR.ADMIN.TOOLBAR">
    <v-card class="mx-auto" elevation="0" rounded="0" :width="admin.width">
      <v-toolbar :color="COLOR.ADMIN.TOOLBAR">
        <v-btn @click="util.go('admin')" prepend-icon="mdi-cog-outline" rounded="xl"
          >Admin
          <v-tooltip activator="parent">클릭하시면 관리화면 첫 페이지로 이동합니다</v-tooltip>
        </v-btn>

        <v-breadcrumbs :items="admin.breadcrumbs">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>

        <v-spacer></v-spacer>

        <v-btn @click="util.go('home')" prepend-icon="mdi-home" rounded="xl"
          >Home
          <v-tooltip activator="parent">클릭하시면 웹사이트 홈 화면으로 이동합니다</v-tooltip>
        </v-btn>
      </v-toolbar>
    </v-card>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useUtilStore } from "../../../store/util"
import { useAdminStore } from "../../../store/admin/common"
import { useHomeStore } from "../../../store/home"
import { COLOR } from "../../../../tsboard.config"

const util = useUtilStore()
const admin = useAdminStore()
const home = useHomeStore()
</script>
