<template>
  <v-card-actions class="mt-6 pa-0">
    <v-btn icon size="small" :color="COLOR.HOME.MAIN">
      <v-icon>mdi-magnify</v-icon>
      <v-menu activator="parent" :close-on-content-click="false">
        <trade-list-search></trade-list-search>
      </v-menu>
      <v-tooltip activator="parent">{{ TEXT[home.lang].SEARCH }}</v-tooltip>
    </v-btn>
    <v-btn
      icon
      :disabled="list.page < 2 || list.loading"
      @click="movePrevPage"
      size="small"
      :color="COLOR.HOME.MAIN"
    >
      <v-icon>mdi-chevron-left</v-icon>
      <v-tooltip activator="parent">{{ TEXT[home.lang].PREV }}</v-tooltip>
    </v-btn>
    <v-btn
      icon
      :disabled="list.page >= list.pageLength || list.loading"
      @click="moveNextPage"
      size="small"
      :color="COLOR.HOME.MAIN"
    >
      <v-icon>mdi-chevron-right</v-icon>
      <v-tooltip activator="parent">{{ TEXT[home.lang].NEXT }}</v-tooltip>
    </v-btn>

    <v-spacer></v-spacer>

    <v-chip variant="tonal" :color="COLOR.HOME.MAIN" v-if="home.isMobile === false" size="small"
      >{{ list.page }} / {{ list.pageLength }}
    </v-chip>

    <v-spacer v-if="home.isMobile === false"></v-spacer>

    <v-btn
      prepend-icon="mdi-list-box-outline"
      @click="list.init"
      v-if="home.isMobile === false"
      rounded="pill"
      :color="COLOR.HOME.MAIN"
      >{{ TEXT[home.lang].LIST }}</v-btn
    >

    <v-btn
      prepend-icon="mdi-pencil"
      @click="util.go(util.routerName(list.config.type, BOARD_ACTION.WRITE), list.id)"
      :disabled="auth.user.uid < 1"
      :color="COLOR.HOME.MAIN"
      variant="flat"
      rounded="pill"
      >{{ TEXT[home.lang].WRITE }}</v-btn
    >
  </v-card-actions>
</template>

<script setup lang="ts">
import { COLOR } from "../../../../tsboard.config"
import { BOARD_ACTION } from "../../../interface/board_interface"
import { TEXT } from "../../../messages/pages/board/list"
import { useBoardListStore } from "../../../store/board/list"
import { useTradeStore } from "../../../store/board/trade"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"
import TradeListSearch from "./TradeListSearch.vue"

const auth = useAuthStore()
const list = useBoardListStore()
const util = useUtilStore()
const home = useHomeStore()
const trade = useTradeStore()

// 이전 페이지로 이동
async function movePrevPage(): Promise<void> {
  await list.movePrevPage()
  await trade.loadTradeList(list.posts)
}

// 다음 페이지로 이동
async function moveNextPage(): Promise<void> {
  await list.moveNextPage()
  await trade.loadTradeList(list.posts)
}
</script>
