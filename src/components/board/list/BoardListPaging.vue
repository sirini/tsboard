<template>
  <v-card-actions class="mt-3 mb-3">
    <v-btn prepend-icon="mdi-magnify"
      >검색
      <v-menu activator="parent" :close-on-content-click="false">
        <board-list-search></board-list-search>
      </v-menu>
    </v-btn>
    <v-btn prepend-icon="mdi-chevron-left" :disabled="list.page < 2" @click="list.loadPrevPosts"
      >이전</v-btn
    >
    <v-btn
      append-icon="mdi-chevron-right"
      :disabled="list.page >= list.pageLength"
      @click="list.loadNextPosts"
      >다음</v-btn
    >

    <v-spacer></v-spacer>
    <v-chip
      variant="tonal"
      color="blue-grey-lighten-3"
      v-if="home.cols < TSBOARD.SCREEN.MOBILE.COLS"
      >{{ list.page }} / {{ list.pageLength }}
    </v-chip>
    <v-spacer v-if="home.cols < TSBOARD.SCREEN.MOBILE.COLS"></v-spacer>

    <v-btn prepend-icon="mdi-list-box-outline" @click="list.init">목록</v-btn>
    <v-btn
      prepend-icon="mdi-pencil"
      variant="text"
      @click="util.go('boardWrite', list.id)"
      :disabled="auth.user.uid < 1"
      >글작성</v-btn
    >
  </v-card-actions>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"
import { useBoardListStore } from "../../../store/board/list"
import { useHomeStore } from "../../../store/home"
import BoardListSearch from "./BoardListSearch.vue"
import { TSBOARD } from "../../../../tsboard.config"

const auth = useAuthStore()
const list = useBoardListStore()
const util = useUtilStore()
const home = useHomeStore()
</script>
