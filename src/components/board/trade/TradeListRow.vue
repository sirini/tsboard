<template>
  <v-card
    rounded="xl"
    class="mt-3"
    v-for="(post, index) in list.posts"
    :key="index"
    @click="util.go(list.config.type, list.id, post.uid)"
    :color="COLOR.HOME.BACKGROUND"
    variant="outlined"
  >
    <v-list-item class="pa-0">
      <template v-slot:prepend>
        <v-card :width="90" elevation="0" rounded="0" class="pa-0">
          <v-img
            cover
            :height="90"
            :src="TSBOARD.PREFIX + post.cover"
            v-if="post.cover.length > 0"
          ></v-img>
          <v-sheet height="120" :color="COLOR.HOME.BACKGROUND" v-else></v-sheet>
        </v-card>
      </template>

      <v-card elevation="0" rounded="0">
        <v-card-title :class="home.isMobile ? 'title-mobile' : 'title'" class="pa-0 pt-2 pl-4 pr-4">
          <v-chip
            v-if="list.config.useCategory && post.status === STATUS.NORMAL"
            size="small"
            :color="COLOR.HOME.MAIN"
            class="mr-2"
            >{{ post.category.name }}</v-chip
          >
          {{ util.unescape(post.title) }}
        </v-card-title>

        <v-card-actions class="pa-0 pl-4 pr-4">
          <v-chip
            :prepend-icon="'mdi-currency-' + CURRENCY"
            variant="outlined"
            size="small"
            :disabled="trade.items[index].status != TRADE_STATUS.OPEN"
            v-if="trade.items.length > 0"
          >
            <strong>{{ trade.items[index].price.toLocaleString() }}</strong></v-chip
          >

          <trade-view-info-line
            :item="trade.items[index]"
            v-if="trade.items.length > 0 && !home.isMobile"
          ></trade-view-info-line>

          <v-spacer></v-spacer>

          <v-chip
            size="small"
            prepend-icon="mdi-heart"
            color="red"
            variant="text"
            v-if="post.liked"
            >{{ util.num(post.like) }}</v-chip
          >

          <v-chip
            size="small"
            prepend-icon="mdi-heart-outline"
            :color="COLOR.HOME.MAIN"
            variant="text"
            v-else
            >{{ util.num(post.like) }}</v-chip
          >

          <v-chip
            size="small"
            :color="COLOR.HOME.MAIN"
            prepend-icon="mdi-chat-outline"
            variant="text"
            v-if="!home.isMobile"
            >{{ util.num(post.comment) }}</v-chip
          >

          <v-chip
            size="small"
            prepend-icon="mdi-eye-outline"
            :color="COLOR.HOME.MAIN"
            variant="text"
            v-if="!home.isMobile"
            >{{ util.num(post.hit) }}</v-chip
          >

          <v-chip
            size="small"
            :prepend-avatar="TSBOARD.PREFIX + (post.writer.profile || '/no-profile.svg')"
            variant="text"
            >{{ post.writer.name }}</v-chip
          >
        </v-card-actions>
      </v-card>
    </v-list-item>
  </v-card>
</template>

<script setup lang="ts">
import { COLOR, CURRENCY, TSBOARD } from "../../../../tsboard.config"
import { STATUS } from "../../../interface/board_interface"
import { TRADE_STATUS } from "../../../interface/trade_interface"
import { useBoardListStore } from "../../../store/board/list"
import { useTradeStore } from "../../../store/board/trade"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"
import TradeViewInfoLine from "./TradeViewInfoLine.vue"

const list = useBoardListStore()
const home = useHomeStore()
const util = useUtilStore()
const trade = useTradeStore()
</script>

<style lang="css" scoped>
.title {
  font-size: 1.2em;
}
.title-mobile {
  font-size: 1em;
  font-weight: bold;
}
</style>
