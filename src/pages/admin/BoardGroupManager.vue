<template>
  <v-app :style="bgColor" :theme="COLOR.ADMIN.THEME">
    <admin-header></admin-header>
    <v-container>
      <v-card class="mx-auto admin" :color="COLOR.ADMIN.MAIN" :max-width="admin.width" rounded="xl">
        <v-card-title>{{ general.group.id }} 그룹 관리</v-card-title>
        <v-layout>
          <v-navigation-drawer permanent location="left" :width="admin.sidebarWidth">
            <v-list>
              <v-list-item prepend-icon="mdi-cog-outline" append-icon="mdi-chevron-right" @click="">
                <strong>일반</strong>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main">
            <board-group-general></board-group-general>
          </v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRoute } from "vue-router"
import { useAdminStore } from "../../store/admin/common"
import { useAdminGroupGeneralStore } from "../../store/admin/group/general"
import { COLOR, TSBOARD } from "../../../tsboard.config"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import BoardGroupGeneral from "../../components/admin/group/BoardGroupGeneral.vue"

const route = useRoute()
const admin = useAdminStore()
const general = useAdminGroupGeneralStore()

admin.clearBreadcrumbs()
admin.addBreadcrumbs("게시판 그룹 목록", `${TSBOARD.PREFIX}/admin/board`)
const bgColor = `background-color: ${COLOR.ADMIN.BACKGROUND}`

onMounted(() => {
  if (route.params?.id.length > 1) {
    general.group.id = route.params.id as string
    admin.addBreadcrumbs(
      `${general.group.id} 그룹`,
      `${TSBOARD.PREFIX}/admin/board/group/${general.group.id}`,
    )
  }
})
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
