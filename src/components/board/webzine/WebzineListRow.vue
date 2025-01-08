<template>
  <v-card
    rounded="xl"
    class="mt-3"
    v-for="(post, index) in list.posts"
    :key="index"
    @click="util.go('webzineView', list.id, post.uid)"
    :color="COLOR.HOME.BACKGROUND"
    variant="outlined"
  >
    <v-list-item class="pa-0">
      <template v-slot:prepend>
        <v-card :width="home.isMobile ? 100 : 180" elevation="0" rounded="0" class="pa-0">
          <v-img
            cover
            height="160"
            :src="TSBOARD.PREFIX + post.cover"
            v-if="post.cover.length > 0"
          ></v-img>
          <v-sheet height="160" :color="COLOR.HOME.BACKGROUND" v-else></v-sheet>
        </v-card>
      </template>

      <v-card elevation="0" rounded="0">
        <v-card-title :class="home.isMobile ? 'title-mobile' : ''">
          <span v-if="post.status === STATUS.SECRET">
            <v-icon
              size="x-small"
              :color="COLOR.HOME.MAIN"
              class="mr-2"
              v-if="post.writer.uid === auth.user.uid || list.isAdmin === true"
              >mdi-lock-open-outline</v-icon
            >
            <v-icon size="small" :color="COLOR.HOME.MAIN" class="mr-2" v-else>mdi-lock</v-icon>
          </span>

          <v-chip
            v-if="list.config.useCategory && post.status === STATUS.NORMAL"
            size="x-small"
            :color="COLOR.HOME.MAIN"
            class="mr-2"
            @click="list.loadPostsByCategory(post.category.uid)"
            >{{ post.category.name }}</v-chip
          >

          {{ util.unescape(post.title) }}
        </v-card-title>

        <v-card-text :class="home.isMobile ? 'text-caption' : ''">
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
    </v-list-item>
  </v-card>
</template>

<script setup lang="ts">
import { COLOR, TSBOARD } from "../../../../tsboard.config"
import { STATUS } from "../../../interface/board_interface"
import { useBoardListStore } from "../../../store/board/list"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"

const list = useBoardListStore()
const home = useHomeStore()
const util = useUtilStore()
const auth = useAuthStore()
</script>

<style lang="css" scoped>
.title-mobile {
  font-size: 1em;
  font-weight: bold;
}
</style>
