<template>
  <v-card class="box-post" @click="util.go(type, id, post.uid)" rounded="xl">
    <v-img
      v-if="post.cover.length > 0"
      height="200"
      cover
      :src="TSBOARD.PREFIX + post.cover"
    ></v-img>

    <v-list class="pa-0">
      <v-list-item class="pa-2"
        ><v-list-item-title
          ><v-chip size="small" class="mr-2" :color="COLOR.HOME.MAIN" v-if="useCategory">{{
            util.unescape(post.category.name)
          }}</v-chip
          ><strong>{{ util.unescape(post.title) }}</strong></v-list-item-title
        ></v-list-item
      >
    </v-list>
    <v-divider></v-divider>

    <v-card-text
      v-if="post.cover.length < 1"
      class="post-content tsboard"
      v-html="post.content"
    ></v-card-text>

    <v-divider v-if="post.cover.length < 1"></v-divider>

    <v-card-actions class="pa-0">
      <v-chip
        prepend-icon="mdi-eye-outline"
        :color="COLOR.HOME.MAIN"
        variant="text"
        size="small"
        class="ml-2"
        >{{ util.num(post.hit) }}</v-chip
      >

      <v-chip
        prepend-icon="mdi-chat-outline"
        :color="COLOR.HOME.MAIN"
        variant="text"
        size="small"
        class="ml-1"
        >{{ util.num(post.comment) }}</v-chip
      >

      <v-chip
        class="ml-1"
        :prepend-icon="post.liked ? 'mdi-heart' : 'mdi-heart-outline'"
        :color="post.liked ? 'red' : COLOR.HOME.MAIN"
        variant="text"
        size="small"
      >
        {{ util.num(post.like) }}
      </v-chip>

      <v-spacer></v-spacer>

      <v-chip
        :prepend-avatar="TSBOARD.PREFIX + (post.writer.profile || '/no-profile.svg')"
        size="small"
        :color="COLOR.HOME.MAIN"
        class="mr-2"
        variant="text"
        >{{ util.unescape(post.writer.name) }}</v-chip
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { COLOR, TSBOARD } from "../../../../../tsboard.config"
import "../../../../assets/board/editor.scss"
import { Board } from "../../../../interface/board_interface"
import { BoardHomePostItem } from "../../../../interface/home_interface"
import { useHomeStore } from "../../../../store/home"
import { useUtilStore } from "../../../../store/util"

const home = useHomeStore()
const util = useUtilStore()
const props = defineProps<{
  type: Board
  id: string
  useCategory: boolean
  post: BoardHomePostItem
}>()
</script>

<style scoped>
.box-post {
  height: 299px;
}
.post-title {
  font-size: 1em;
  font-weight: bold;
}
.post-content {
  line-height: 1.8em;
  height: 199px;
  overflow: hidden;
}
</style>
