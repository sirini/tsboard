<template>
  <v-row class="mt-6" no-gutters>
    <v-col :cols="colsBoard" v-for="(board, index) in boards">
      <v-card class="ma-1" rounded="xl">
        <v-list class="pa-0">
          <v-list-item
            append-icon="mdi-chevron-right"
            @click="util.go(board.config.type, board.config.id)"
          >
            <v-list-item-title>
              <strong>{{ board.config.name }}</strong>
            </v-list-item-title>

            <v-tooltip activator="parent" location="bottom">
              {{ board.config.info }}
            </v-tooltip>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item v-for="(post, index) in board.items" :key="index">
            <template v-slot:prepend>
              <v-chip
                size="small"
                :color="post.liked ? 'red' : COLOR.HOME.MAIN"
                :prepend-icon="post.liked ? 'mdi-heart' : 'mdi-heart-outline'"
                >{{ post.like }}</v-chip
              >
            </template>

            <v-list-item-title
              class="ml-2 link"
              @click="util.go(board.config.type, board.config.id, post.uid)"
            >
              {{ post.title }}
              <v-chip
                variant="text"
                prepend-icon="mdi-chat-outline"
                :color="COLOR.HOME.MAIN"
                size="small"
                >{{ post.comment }}</v-chip
              >
            </v-list-item-title>

            <template v-slot:append>
              <v-chip size="small" variant="text" :color="COLOR.HOME.MAIN">{{
                util.date(post.submitted)
              }}</v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-3" v-if="gallery.config.uid > 0">
    <v-col>
      <v-card class="ma-1" rounded="xl">
        <v-list class="pa-0">
          <v-list-item
            append-icon="mdi-chevron-right"
            @click="util.go(gallery.config.type, gallery.config.id)"
          >
            <v-list-item-title
              ><strong>{{ gallery.config.name }}</strong></v-list-item-title
            >
            <v-tooltip activator="parent" location="bottom">
              {{ gallery.config.info }}
            </v-tooltip>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item class="pt-3 pb-3">
            <v-row no-gutters>
              <v-col v-for="(post, index) in gallery.items" :key="index" :cols="colsPhoto">
                <v-card
                  class="ma-1"
                  @click="util.go(gallery.config.type, gallery.config.id, post.uid)"
                  rounded="xl"
                >
                  <v-img cover :src="TSBOARD.PREFIX + post.cover" height="200"></v-img>
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
import { BOARD_HOME_POST_RESULT, BoardHomePostResult } from "../../interface/home_interface"
import { COLOR, TSBOARD } from "../../../tsboard.config"

const home = useHomeStore()
const util = useUtilStore()
const colsBoard = ref<number>(6)
const colsPhoto = ref<number>(2)
const boards = ref<BoardHomePostResult[]>([])
const gallery = ref<BoardHomePostResult>(BOARD_HOME_POST_RESULT)
const columns = TSBOARD.SITE.HOME.COLUMNS

onMounted(async () => {
  home.setGridLayout()
  if (home.isMobile) {
    colsBoard.value = 12
    colsPhoto.value = 6
  } else if (home.isTablet) {
    colsBoard.value = columns.COLS
    colsPhoto.value = 3
  } else {
    colsBoard.value = columns.COLS
    colsPhoto.value = 2
  }

  columns.BOARDS.map(async (board) => {
    boards.value.push(await home.getBoardLatestPosts(board.id, board.limit))
  })

  if (columns.GALLERY.id.length > 0) {
    gallery.value = await home.getBoardLatestPosts(columns.GALLERY.id, columns.GALLERY.limit)
  }
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
