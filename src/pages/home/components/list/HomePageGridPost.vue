<template>
  <v-card
    rounded="xl"
    class="box"
    @click="
      util.go(post.type === BOARD_TYPE.BOARD ? 'boardView' : 'galleryOpen', post.id, post.uid)
    "
  >
    <v-img
      v-if="post.cover.length > 0"
      height="200"
      cover
      :src="TSBOARD.PREFIX + post.cover"
    ></v-img>

    <v-card-title class="post-title">
      <v-chip size="small" class="mr-2" label color="blue-grey" v-if="post.useCategory">{{
        util.unescape(post.category)
      }}</v-chip
      >{{ util.unescape(post.title) }}</v-card-title
    >
    <v-divider></v-divider>

    <v-card-text
      v-if="post.cover.length < 1"
      class="post-content"
      v-html="post.content"
    ></v-card-text>

    <v-divider v-if="post.cover.length < 1"></v-divider>

    <v-card-actions class="pl-3 pr-3">
      <v-chip prepend-icon="mdi-eye-outline" color="blue-grey" size="small">{{
        util.num(post.hit)
      }}</v-chip>
      <v-chip
        class="ml-2"
        :prepend-icon="post.liked ? 'mdi-heart' : 'mdi-heart-outline'"
        :color="post.liked ? 'red' : 'blue-grey'"
        size="small"
      >
        {{ util.num(post.like) }}
      </v-chip>

      <v-spacer></v-spacer>

      <v-chip
        :prepend-avatar="
          TSBOARD.PREFIX +
          (post.writer.profile.length > 0 ? post.writer.profile : '/no-profile.svg')
        "
        size="small"
        color="blue-grey"
        >{{ util.unescape(post.writer.name) }}</v-chip
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useUtilStore } from "../../../../store/util"
import { BOARD_TYPE } from "../../../../interface/board"
import { PostItem } from "../../../../interface/home"
import { TSBOARD } from "../../../../../tsboard.config"

const util = useUtilStore()
const props = defineProps<{
  post: PostItem
}>()
</script>

<style scoped>
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
