<template>
  <v-list-item
    class="list-item pa-0"
    v-for="(post, index) in list.posts"
    :key="index"
    :lines="home.isMobile ? 'two' : 'one'"
    :class="post.status === CONTENT_STATUS.NOTICE ? 'notice' : ''"
  >
    <template v-slot:prepend v-if="home.isMobile === false">
      <span class="col no text-center">{{ post.uid }}</span>
    </template>

    <v-list-item-title class="pointer ml-2 mr-2" @click="util.go('boardView', list.id, post.uid)">
      <v-icon
        size="x-small"
        :color="home.color.header"
        class="mr-2"
        v-if="post.status === CONTENT_STATUS.NOTICE"
        >mdi-bullhorn-variant-outline</v-icon
      >

      <span v-if="post.status === CONTENT_STATUS.SECRET">
        <v-icon
          size="x-small"
          :color="home.color.header"
          class="mr-2"
          v-if="post.writer.uid === auth.user.uid || list.isAdmin === true"
          >mdi-lock-open-outline</v-icon
        >
        <v-icon size="small" :color="home.color.header" class="mr-2" v-else>mdi-lock</v-icon>
      </span>

      <v-chip
        v-if="list.config.useCategory && post.status === CONTENT_STATUS.NORMAL"
        size="x-small"
        :color="home.color.header"
        class="mr-2"
        @click="list.loadPostsByCategory(post.category.uid)"
        >{{ post.category.name }}</v-chip
      >

      {{ util.unescape(post.title) }}

      <span v-if="home.isMobile === false">
        <v-chip
          size="x-small"
          :color="home.color.header"
          class="ml-2"
          prepend-icon="mdi-chat-outline"
          variant="text"
          v-if="post.reply > 0"
          >{{ util.num(post.reply) }}</v-chip
        >

        <v-chip
          size="x-small"
          prepend-icon="mdi-heart"
          color="red"
          variant="text"
          v-if="post.liked"
          >{{ util.num(post.like) }}</v-chip
        >

        <v-chip
          size="x-small"
          prepend-icon="mdi-heart-outline"
          :color="home.color.header"
          variant="text"
          v-else
          >{{ util.num(post.like) }}</v-chip
        >
      </span>
    </v-list-item-title>

    <v-list-item-subtitle v-if="home.isMobile" class="mt-2 mb-1">
      <user-nametag
        :uid="post.writer.uid"
        :name="post.writer.name"
        :profile="post.writer.profile"
        class="ml-1 mr-1"
        size="x-small"
      ></user-nametag>

      <v-chip
        size="x-small"
        :color="home.color.header"
        class="ml-2"
        prepend-icon="mdi-chat-outline"
        variant="text"
        v-if="post.reply > 0"
        >{{ util.num(post.reply) }}</v-chip
      >

      <v-chip
        size="x-small"
        prepend-icon="mdi-heart"
        color="red"
        variant="text"
        v-if="post.liked"
        >{{ util.num(post.like) }}</v-chip
      >

      <v-chip
        size="x-small"
        prepend-icon="mdi-heart-outline"
        :color="home.color.header"
        variant="text"
        v-if="post.liked === false"
        >{{ util.num(post.like) }}</v-chip
      >

      <v-chip
        size="x-small"
        prepend-icon="mdi-eye-outline"
        :color="home.color.header"
        variant="text"
        >{{ util.num(post.hit) }}</v-chip
      >
    </v-list-item-subtitle>

    <template v-slot:append>
      <user-nametag
        v-if="home.isMobile === false"
        :uid="post.writer.uid"
        :name="post.writer.name"
        :profile="post.writer.profile"
        size="x-small"
      ></user-nametag>

      <span class="col no text-center" v-if="home.isMobile === false">{{
        util.num(post.hit)
      }}</span>
      <v-divider vertical v-if="home.isMobile === false"></v-divider>
      <span class="col date text-center" v-if="home.isMobile === false">{{
        util.date(post.submitted)
      }}</span>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { CONTENT_STATUS } from "../../../../server/database/board/const"
import { useBoardListStore } from "../../../store/board/list"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"
import UserNametag from "../../user/UserNametag.vue"

const list = useBoardListStore()
const home = useHomeStore()
const util = useUtilStore()
const auth = useAuthStore()
</script>

<style scoped>
.notice {
  background-color: #f9f9f9;
}
.list-item {
  border-bottom: 1px #ddd solid;

  .col {
    color: #828282;
    font-size: 0.85em;
  }
  .pointer {
    cursor: pointer;
  }
  .no {
    width: 70px;
  }
  .date {
    width: 80px;
  }
}
</style>
