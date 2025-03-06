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
              <v-list class="pa-0" rounded="t-xl">
                <v-list-item v-if="list.posts.length < 1" class="text-center pa-6">
                  <v-icon>mdi-alert-circle</v-icon> {{ TEXT[home.lang].EMPTY }}
                </v-list-item>

                <board-list-row-notice></board-list-row-notice>
                <trade-list-row></trade-list-row>
              </v-list>
            </v-card-text>
            <board-list-paging></board-list-paging>
          </v-card>
        </v-container>
        <home-footer></home-footer>
      </v-main>
      <side-notification-drawer></side-notification-drawer>
    </v-layout>
    <user-info-dialog></user-info-dialog>
    <send-report-dialog></send-report-dialog>
    <manage-user-dialog></manage-user-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import { useBoardListStore } from "../../store/board/list"
import { useHomeStore } from "../../store/home"
import { useTradeStore } from "../../store/board/trade"
import BoardListRowNotice from "../../components/board/list/BoardListRowNotice.vue"
import BoardListPaging from "../../components/board/list/BoardListPaging.vue"
import TradeListRow from "../../components/board/trade/TradeListRow.vue"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import SideDrawer from "../home/SideDrawer.vue"
import SideNotificationDrawer from "../home/SideNotificationDrawer.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import { TEXT } from "../../messages/pages/board/list"
import { COLOR } from "../../../tsboard.config"

const route = useRoute()
const list = useBoardListStore()
const home = useHomeStore()
const trade = useTradeStore()
const bgColor = `background-color: ${COLOR.HOME.BACKGROUND}`

onMounted(async () => {
  await list.loadPostList()

  const postUids: number[] = []
  list.posts.map((post) => postUids.push(post.uid))
  await trade.loadTradeList(postUids)
  await home.setGridLayout()
})

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
