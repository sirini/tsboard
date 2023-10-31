<template>
  <v-app>
    <admin-header></admin-header>
    <v-container class="admin">
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <v-icon icon="mdi-chevron-right"></v-icon>
        </template>
      </v-breadcrumbs>
      <v-card class="mx-auto rounded-lg" variant="outlined">
        <v-card-title
          ><strong>{{ general.board.id }}</strong> 게시판 설정</v-card-title
        >
        <v-divider></v-divider>
        <v-layout>
          <v-navigation-drawer permanent location="left" width="250">
            <v-list>
              <v-list-item
                prepend-icon="mdi-cog-outline"
                append-icon="mdi-chevron-right"
                @click="admin.menu = MENU.BOARD.GENERAL"
              >
                <strong v-if="admin.menu === MENU.BOARD.GENERAL">일반</strong>
                <span v-else>일반</span>
              </v-list-item>
              <v-list-item
                prepend-icon="mdi-account-check-outline"
                append-icon="mdi-chevron-right"
                @click="admin.menu = MENU.BOARD.PERMISSION"
              >
                <strong v-if="admin.menu === MENU.BOARD.PERMISSION">권한</strong>
                <span v-else>권한</span>
              </v-list-item>
              <v-list-item
                prepend-icon="mdi-cash-100"
                append-icon="mdi-chevron-right"
                @click="admin.menu = MENU.BOARD.POINT"
              >
                <strong v-if="admin.menu === MENU.BOARD.POINT">포인트</strong>
                <span v-else>포인트</span>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main">
            <board-manager-general v-if="admin.menu === MENU.BOARD.GENERAL"></board-manager-general>
            <board-manager-permission
              v-if="admin.menu === MENU.BOARD.PERMISSION"
            ></board-manager-permission>
            <board-manager-point v-if="admin.menu === MENU.BOARD.POINT"></board-manager-point>
          </v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
    <confirm-remove-category-dialog></confirm-remove-category-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { watchEffect } from "vue"
import { useRoute } from "vue-router"
import { useAdminStore, MENU } from "../../store/admin/common"
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
const PREFIX = process.env.PREFIX || ""
const breadcrumbs = [
  {
    title: "Admin",
    disabled: false,
    href: PREFIX + "/admin",
  },
  {
    title: "Group List",
    disabled: false,
    href: PREFIX + "/admin/board",
  },
  {
    title: `${general.board.group.selected} Group`,
    disabled: false,
    href: PREFIX + "/admin/board/group/" + general.board.group.selected,
  },
  {
    title: general.board.id,
    disabled: true,
    href: PREFIX + "/admin/board/" + general.board.id,
  },
]

watchEffect(() => {
  if (route.params?.id.length > 1) {
    general.board.id = route.params?.id.toString()
  }
})
</script>

<style scoped>
.admin {
  margin-top: 64px;
}
.main {
  min-height: 300px;
}
</style>
