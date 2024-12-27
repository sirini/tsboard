<template>
  <v-card elevation="0" @click="util.go(type, id, post.uid)">
    <v-img
      cover
      v-if="post.cover.length > 0"
      height="250"
      :src="TSBOARD.PREFIX + post.cover"
    ></v-img>

    <v-list class="pa-0">
      <v-list-item class="pa-2"
        ><v-list-item-title
          ><v-chip size="small" class="mr-2" label :color="COLOR.HOME.HEADER" v-if="useCategory">{{
            util.unescape(post.category.name)
          }}</v-chip
          ><strong>{{ util.unescape(post.title) }}</strong></v-list-item-title
        ></v-list-item
      >
    </v-list>
    <v-divider></v-divider>

    <v-card-text
      v-if="post.cover.length < 1"
      class="pa-3 post-content tsboard"
      v-html="post.content"
    ></v-card-text>

    <v-divider v-if="post.cover.length < 1"></v-divider>

    <v-card-actions class="pa-0">
      <v-chip
        prepend-icon="mdi-eye-outline"
        variant="text"
        color="grey-darken-2"
        size="small"
        class="ml-2"
        label
        >{{ util.num(post.hit) }}</v-chip
      >

      <v-chip
        prepend-icon="mdi-chat-outline"
        variant="text"
        color="grey-darken-2"
        size="small"
        class="ml-1"
        label
        >{{ util.num(post.comment) }}</v-chip
      >

      <v-chip
        class="ml-1"
        :prepend-icon="post.liked ? 'mdi-heart' : 'mdi-heart-outline'"
        :color="post.liked ? 'red' : 'grey-darken-2'"
        variant="text"
        size="small"
        label
      >
        {{ util.num(post.like) }}
      </v-chip>

      <v-spacer></v-spacer>

      <v-chip class="mr-1" variant="text" color="grey-darken-2" size="small" label>{{
        util.date(post.submitted)
      }}</v-chip>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { COLOR, TSBOARD } from "../../../tsboard.config"
import "../../assets/board/editor.scss"
import { Board, BoardListItem } from "../../interface/board_interface"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"

const util = useUtilStore()
const home = useHomeStore()
const props = defineProps<{ post: BoardListItem; type: Board; useCategory: boolean; id: string }>()
</script>

<style scoped>
.post-content {
  line-height: 1.7em;
  height: 249px;
  overflow: hidden;
}
</style>
