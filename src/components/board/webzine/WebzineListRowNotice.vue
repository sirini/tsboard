<template>
  <v-list-item
    class="list-item pa-0 notice"
    v-for="(notice, index) in list.notices"
    :key="index"
    :lines="home.isMobile ? 'two' : 'one'"
  >
    <v-list-item-title class="pointer ml-3" @click="util.go('webzineView', list.id, notice.uid)">
      <v-icon size="x-small" :color="COLOR.HOME.MAIN" class="mr-2"
        >mdi-bullhorn-variant-outline</v-icon
      >

      {{ util.unescape(notice.title) }}

      <span v-if="home.isMobile === false">
        <v-chip
          size="x-small"
          :color="COLOR.HOME.MAIN"
          class="ml-2"
          prepend-icon="mdi-chat-outline"
          variant="text"
          v-if="notice.comment > 0"
          >{{ util.num(notice.comment) }}</v-chip
        >

        <v-chip
          size="x-small"
          prepend-icon="mdi-heart"
          color="red"
          variant="text"
          v-if="notice.liked"
          >{{ util.num(notice.like) }}</v-chip
        >

        <v-chip
          size="x-small"
          prepend-icon="mdi-heart-outline"
          :color="COLOR.HOME.MAIN"
          variant="text"
          v-else
          >{{ util.num(notice.like) }}</v-chip
        >
      </span>
    </v-list-item-title>

    <v-list-item-subtitle v-if="home.isMobile" class="mt-2 text-right">
      <v-chip
        size="x-small"
        :color="COLOR.HOME.MAIN"
        class="ml-2"
        prepend-icon="mdi-chat-outline"
        variant="text"
        v-if="notice.comment > 0"
        >{{ util.num(notice.comment) }}</v-chip
      >

      <v-chip
        size="x-small"
        prepend-icon="mdi-heart"
        color="red"
        variant="text"
        v-if="notice.liked"
        >{{ util.num(notice.like) }}</v-chip
      >

      <v-chip
        size="x-small"
        prepend-icon="mdi-heart-outline"
        :color="COLOR.HOME.MAIN"
        variant="text"
        v-if="notice.liked === false"
        >{{ util.num(notice.like) }}</v-chip
      >

      <v-chip
        size="x-small"
        prepend-icon="mdi-eye-outline"
        :color="COLOR.HOME.MAIN"
        variant="text"
        >{{ util.num(notice.hit) }}</v-chip
      >

      <user-nametag
        :uid="notice.writer.uid"
        :name="notice.writer.name"
        :profile="notice.writer.profile"
        class="ml-1 mr-1"
        size="x-small"
      ></user-nametag>
    </v-list-item-subtitle>

    <template v-slot:append>
      <user-nametag
        v-if="home.isMobile === false"
        :uid="notice.writer.uid"
        :name="notice.writer.name"
        :profile="notice.writer.profile"
        size="x-small"
        class="mr-3"
      ></user-nametag>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { COLOR } from "../../../../tsboard.config"
import { useWebzineListStore } from "../../../store/board/webzine"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"
import UserNametag from "../../user/UserNametag.vue"

const list = useWebzineListStore()
const home = useHomeStore()
const util = useUtilStore()
</script>

<style scoped>
.notice {
  background-color: #f9f9f9;
}
.list-item {
  border-bottom: 1px #efefef solid;

  .col {
    color: #717171;
    font-size: 0.8em;
  }
  .pointer {
    cursor: pointer;
  }
  .no {
    width: 60px;
  }
  .date {
    width: 70px;
  }
}
</style>
