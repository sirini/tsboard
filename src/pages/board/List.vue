<template>
  <v-app :style="bgColor" :theme="COLOR.HOME.THEME">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <board-header :config="list.config"></board-header>
          <v-card
            class="mx-auto pa-3 mt-5"
            :max-width="list.config.width"
            :loading="list.loading"
            rounded="xl"
          >
            <v-card-text class="pa-0">
              <v-list class="pa-0">
                <v-list-item v-if="list.posts.length < 1" class="text-center pa-6">
                  <v-icon>mdi-alert-circle</v-icon> {{ TEXT[home.lang].EMPTY }}
                </v-list-item>

                <board-list-row></board-list-row>
              </v-list>
            </v-card-text>
            <board-list-paging></board-list-paging>
          </v-card>
        </v-container>
        <home-footer></home-footer>
        <quick-button v-if="home.isMobile"></quick-button>
      </v-main>
    </v-layout>
    <user-info-dialog></user-info-dialog>
    <send-report-dialog></send-report-dialog>
    <manage-user-dialog></manage-user-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardListPaging from "../../components/board/list/BoardListPaging.vue"
import BoardListRow from "../../components/board/list/BoardListRow.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import { TEXT } from "../../messages/pages/board/list"
import { useBoardListStore } from "../../store/board/list"
import { useHomeStore } from "../../store/home"
import HomeFooter from "../home/HomeFooter.vue"
import HomeHeader from "../home/HomeHeader.vue"
import SideDrawer from "../home/SideDrawer.vue"
import QuickButton from "../home/components/mobile/QuickButton.vue"
import { COLOR } from "../../../tsboard.config"

const route = useRoute()
const list = useBoardListStore()
const home = useHomeStore()
const bgColor = `background-color: ${COLOR.HOME.BACKGROUND}`

onMounted(() => list.initFirstList())

watch(
  () => route.params?.id,
  () => list.resetBoardList(),
)
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 130px);
}
</style>
