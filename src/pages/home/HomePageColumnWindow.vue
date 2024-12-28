<template>
  <v-row class="mt-6" no-gutters>
    <v-col :cols="colsBoard">
      <v-card class="ma-1" rounded="xl">
        <v-list class="pa-0">
          <v-list-item
            append-icon="mdi-chevron-right"
            @click="util.go(free.config.type, free.config.id)"
          >
            <v-list-item-title>
              <strong>{{ free.config.name }}</strong>
            </v-list-item-title>

            <v-tooltip activator="parent" location="bottom">
              {{ free.config.info }}
            </v-tooltip>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item v-for="(post, index) in free.items" :key="index">
            <template v-slot:prepend>
              <v-chip
                size="small"
                :color="post.liked ? 'red' : 'blue-grey-lighten-2'"
                :prepend-icon="post.liked ? 'mdi-heart' : 'mdi-heart-outline'"
                >{{ post.like }}</v-chip
              >
            </template>

            <v-list-item-title
              class="ml-2 link"
              @click="util.go(free.config.type, free.config.id, post.uid)"
            >
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
      <v-card class="ma-1" rounded="xl">
        <v-list class="pa-0">
          <v-list-item
            append-icon="mdi-chevron-right"
            @click="util.go(blog.config.type, blog.config.id)"
          >
            <v-list-item-title>
              <strong>{{ blog.config.name }}</strong>
            </v-list-item-title>

            <v-tooltip activator="parent" location="bottom">
              {{ blog.config.info }}
            </v-tooltip>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item v-for="(post, index) in blog.items" :key="index">
            <template v-slot:prepend>
              <v-chip
                size="small"
                :color="post.liked ? 'red' : 'blue-grey-lighten-2'"
                :prepend-icon="post.liked ? 'mdi-heart' : 'mdi-heart-outline'"
                >{{ post.like }}</v-chip
              >
            </template>

            <v-list-item-title
              class="ml-2 link"
              @click="util.go(blog.config.type, blog.config.id, post.uid)"
            >
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
import { TSBOARD } from "../../../tsboard.config"

const home = useHomeStore()
const util = useUtilStore()
const colsBoard = ref<number>(6)
const colsPhoto = ref<number>(2)

// 아래 부분 [수정 필요]
const free = ref<BoardHomePostResult>(BOARD_HOME_POST_RESULT)
const blog = ref<BoardHomePostResult>(BOARD_HOME_POST_RESULT)
const gallery = ref<BoardHomePostResult>(BOARD_HOME_POST_RESULT)

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
