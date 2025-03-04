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
        <v-card :width="home.isMobile ? 70 : 120" elevation="0" rounded="0" class="pa-0">
          <v-img
            cover
            height="120"
            :src="TSBOARD.PREFIX + post.cover"
            v-if="post.cover.length > 0"
          ></v-img>
          <v-sheet height="120" :color="COLOR.HOME.BACKGROUND" v-else></v-sheet>
        </v-card>
      </template>

      <v-card elevation="0" rounded="0">
        <v-card-title :class="home.isMobile ? 'title-mobile' : ''" class="pa-0 pl-3 pr-3">
          <v-chip
            v-if="trade.items.length > 0 && post.status === STATUS.NORMAL"
            size="x-small"
            :color="COLOR.HOME.MAIN"
            class="mr-2"
            >{{ trade.items[index].categoryStr }}</v-chip
          >

          {{ util.unescape(post.title) }}
        </v-card-title>

        <v-card-text :class="home.isMobile ? 'text-caption' : ''" class="pt-2 pl-3 pr-3 pb-2">
          {{ util.stripTags(post.content).slice(0, home.isMobile ? 60 : 140) }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-chip
            size="small"
            :color="COLOR.HOME.MAIN"
            class="ml-2"
            prepend-icon="mdi-chat-outline"
            variant="text"
            v-if="post.comment > 0"
            >{{ util.num(post.comment) }}</v-chip
          >

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
            v-if="post.liked === false"
            >{{ util.num(post.like) }}</v-chip
          >

          <v-chip
            size="small"
            prepend-icon="mdi-eye-outline"
            :color="COLOR.HOME.MAIN"
            variant="text"
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

      <template v-slot:append v-if="trade.items.length > 0">
        <v-list no-gutters class="pa-0">
          <v-list-item class="text-center pa-0">
            <v-chip prepend-icon="mdi-thumb-up" color="red" v-if="trade.items[index].favorited">
              {{ util.num(trade.items[index].favorites) }}
            </v-chip>
            <v-chip prepend-icon="mdi-thumb-up-outline" :color="COLOR.HOME.MAIN" v-else>
              {{ trade.items[index].favorites }}</v-chip
            >
          </v-list-item>
          <v-list-item class="text-center">
            <v-chip :prepend-icon="'mdi-currency-' + CURRENCY" variant="text"
              ><strong>{{ trade.items[index].price.toLocaleString() }}</strong></v-chip
            >
          </v-list-item>
        </v-list>
      </template>
    </v-list-item>
  </v-card>
</template>

<script setup lang="ts">
import { COLOR, CURRENCY, TSBOARD } from "../../../../tsboard.config"
import { STATUS } from "../../../interface/board_interface"
import { useBoardListStore } from "../../../store/board/list"
import { useTradeStore } from "../../../store/board/trade"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"

const list = useBoardListStore()
const home = useHomeStore()
const util = useUtilStore()
const trade = useTradeStore()
</script>

<style lang="css" scoped>
.title-mobile {
  font-size: 1em;
  font-weight: bold;
}
</style>
