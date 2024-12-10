<template>
  <v-row class="mt-6" no-gutters>
    <v-col :cols="colsBoard">
      <v-card class="ma-1">
        <v-list class="pa-0">
          <v-list-item append-icon="mdi-chevron-right" @click="util.go(free.type, free.id)">
            <v-list-item-title>
              <strong>{{ free.name }}</strong>
            </v-list-item-title>

            <v-tooltip activator="parent" location="bottom">
              {{ free.info }}
            </v-tooltip>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item v-for="(post, index) in free.posts" :key="index">
            <template v-slot:prepend>
              <v-chip
                size="small"
                :color="post.liked ? 'red' : 'blue-grey-lighten-2'"
                :prepend-icon="post.liked ? 'mdi-heart' : 'mdi-heart-outline'"
                >{{ post.like }}</v-chip
              >
            </template>

            <v-list-item-title class="ml-2 link" @click="util.go(free.type, free.id, post.uid)">
              {{ post.title }}
              <v-chip
                variant="text"
                prepend-icon="mdi-chat-outline"
                color="blue-grey-lighten-2"
                size="small"
                >{{ post.comment }}</v-chip
              >
            </v-list-item-title>

            <template v-slot:append>
              <v-chip size="small" variant="text" color="blue-grey-lighten-2">{{
                util.date(post.submitted)
              }}</v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col :cols="colsBoard">
      <v-card class="ma-1">
        <v-list class="pa-0">
          <v-list-item append-icon="mdi-chevron-right" @click="util.go(blog.type, blog.id)">
            <v-list-item-title>
              <strong>{{ blog.name }}</strong>
            </v-list-item-title>

            <v-tooltip activator="parent" location="bottom">
              {{ blog.info }}
            </v-tooltip>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item v-for="(post, index) in blog.posts" :key="index">
            <template v-slot:prepend>
              <v-chip
                size="small"
                :color="post.liked ? 'red' : 'blue-grey-lighten-2'"
                :prepend-icon="post.liked ? 'mdi-heart' : 'mdi-heart-outline'"
                >{{ post.like }}</v-chip
              >
            </template>

            <v-list-item-title class="ml-2 link" @click="util.go(blog.type, blog.id, post.uid)">
              {{ post.title }}
              <v-chip
                variant="text"
                prepend-icon="mdi-chat-outline"
                color="blue-grey-lighten-2"
                size="small"
                >{{ post.comment }}</v-chip
              >
            </v-list-item-title>

            <template v-slot:append>
              <v-chip size="small" variant="text" color="blue-grey-lighten-2">{{
                util.date(post.submitted)
              }}</v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-3">
    <v-col>
      <v-card class="ma-1">
        <v-list class="pa-0">
          <v-list-item append-icon="mdi-chevron-right" @click="util.go(gallery.type, gallery.id)">
            <v-list-item-title
              ><strong>{{ gallery.name }}</strong></v-list-item-title
            >
            <v-tooltip activator="parent" location="bottom">
              {{ gallery.info }}
            </v-tooltip>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-row no-gutters>
              <v-col v-for="(post, index) in gallery.posts" :key="index" :cols="colsPhoto">
                <v-card
                  class="mt-2 mb-2"
                  @click="util.go(gallery.type, gallery.id, post.uid)"
                  variant="text"
                >
                  <v-img
                    cover
                    :src="TSBOARD.PREFIX + post.cover"
                    aspect-ratio="1/1"
                    height="200"
                    class="ma-1"
                  ></v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import { BoardLatestPost, BoardPostItem } from "../../interface/home"
import { BOARD_TYPE } from "../../../server/database/board/const"
import { BoardType } from "../../interface/board"
import { TSBOARD } from "../../../tsboard.config"

const INIT: BoardLatestPost = {
  id: "",
  type: BOARD_TYPE.BOARD as BoardType,
  name: "",
  info: "",
  useCategory: false,
  posts: [] as BoardPostItem[],
}
const home = useHomeStore()
const util = useUtilStore()
const free = ref<BoardLatestPost>(INIT)
const blog = ref<BoardLatestPost>(INIT)
const gallery = ref<BoardLatestPost>(INIT)
const colsBoard = ref<number>(6)
const colsPhoto = ref<number>(2)

onMounted(async () => {
  home.setGridLayout()
  if (home.isMobile) {
    colsBoard.value = 12
    colsPhoto.value = 6
  } else if (home.isTablet) {
    colsBoard.value = 6
    colsPhoto.value = 3
  } else {
    colsBoard.value = 6
    colsPhoto.value = 2
  }

  /*** 아래 변수들은 사이트에 맞게 수정 필요 ***/
  free.value = await home.getBoardLatestPosts("free", 10)
  blog.value = await home.getBoardLatestPosts("sirini", 10)
  gallery.value = await home.getBoardLatestPosts("photo", 6)
})
</script>

<style lang="css" scoped>
.link {
  cursor: pointer;
}
.link:hover {
  font-weight: bold;
}
</style>
