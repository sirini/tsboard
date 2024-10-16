<template>
  <v-card class="box-post" @click="util.go(post.type, post.id, post.uid)">
    <v-img
      v-if="post.cover.length > 0"
      height="200"
      cover
      :src="TSBOARD.PREFIX + post.cover"
    ></v-img>

    <v-list class="pa-0">
      <v-list-item class="pa-2"
        ><v-list-item-title
          ><v-chip
            size="small"
            class="mr-2"
            label
            :color="home.color.header"
            v-if="post.useCategory"
            >{{ util.unescape(post.category) }}</v-chip
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
        :color="home.color.header"
        variant="text"
        size="small"
        class="ml-2"
        label
        >{{ util.num(post.hit) }}</v-chip
      >

      <v-chip
        prepend-icon="mdi-chat-outline"
        :color="home.color.header"
        variant="text"
        size="small"
        class="ml-1"
        label
        >{{ util.num(post.comment) }}</v-chip
      >

      <v-chip
        class="ml-1"
        :prepend-icon="post.liked ? 'mdi-heart' : 'mdi-heart-outline'"
        :color="post.liked ? 'red' : home.color.header"
        variant="text"
        size="small"
        label
      >
        {{ util.num(post.like) }}
      </v-chip>

      <v-spacer></v-spacer>

      <v-chip
        :prepend-avatar="TSBOARD.PREFIX + (post.writer.profile || '/no-profile.svg')"
        size="small"
        :color="home.color.header"
        class="mr-2"
        label
        >{{ util.unescape(post.writer.name) }}</v-chip
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { TSBOARD } from "../../../../../tsboard.config"
import "../../../../assets/board/editor.scss"
import { PostItem } from "../../../../interface/home"
import { useHomeStore } from "../../../../store/home"
import { useUtilStore } from "../../../../store/util"

const home = useHomeStore()
const util = useUtilStore()
const props = defineProps<{
  post: PostItem
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
