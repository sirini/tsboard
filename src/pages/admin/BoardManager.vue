<template>
  <v-app class="app">
    <admin-header></admin-header>
    <v-container>
      <v-card class="mx-auto rounded-lg admin" color="blue-grey">
        <v-card-title
          ><strong>{{ general.board.id }}</strong> 게시판 관리</v-card-title
        >
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
              <v-list-item
                prepend-icon="mdi-account-check-outline"
                append-icon="mdi-chevron-right"
                @click="menu = 'permission'"
              >
                <strong v-if="menu === 'permission'">권한</strong>
                <span v-else>권한</span>
              </v-list-item>
              <v-list-item
                prepend-icon="mdi-cash-100"
                append-icon="mdi-chevron-right"
                @click="menu = 'point'"
              >
                <strong v-if="menu === 'point'">포인트</strong>
                <span v-else>포인트</span>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main">
            <board-manager-general v-if="menu === 'normal'"></board-manager-general>
            <board-manager-permission v-if="menu === 'permission'"></board-manager-permission>
            <board-manager-point v-if="menu === 'point'"></board-manager-point>
          </v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
    <confirm-remove-category-dialog></confirm-remove-category-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { useAdminStore } from "../../store/admin/common"
import { useAdminBoardGeneralStore } from "../../store/admin/board/general"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import BoardManagerGeneral from "../../components/admin/board/BoardManagerGeneral.vue"
import BoardManagerPermission from "../../components/admin/board/BoardManagerPermission.vue"
import BoardManagerPoint from "../../components/admin/board/BoardManagerPoint.vue"
import ConfirmRemoveCategoryDialog from "../../components/admin/board/ConfirmRemoveCategoryDialog.vue"

const route = useRoute()
const admin = useAdminStore()
const general = useAdminBoardGeneralStore()
const menu = ref<"normal" | "permission" | "point">("normal")

onMounted(() => {
  general.board.id = route.params.id as string
})

watch(
  () => general.board.groupUid,
  () => {
    general.updateGroupName()

    admin.clearBreadcrumbs()
    admin.addBreadcrumbs("게시판 그룹 목록", `${process.env.PREFIX}/admin/board`)
    admin.addBreadcrumbs(
      `${general.boardGroupName} 그룹`,
      `${process.env.PREFIX}/admin/board/group/${general.boardGroupName}`,
    )
    admin.addBreadcrumbs(
      `${general.board.id} 게시판 관리`,
      `${process.env.PREFIX}/admin/board/${general.board.id}`,
    )
  },
)
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
  background-color: white;
}
</style>
