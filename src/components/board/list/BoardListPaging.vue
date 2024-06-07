<template>
  <v-card-actions class="mt-3 mb-3">
    <v-btn prepend-icon="mdi-magnify"
      >{{ TEXT[home.lang].SEARCH }}
      <v-menu activator="parent" :close-on-content-click="false">
        <board-list-search></board-list-search>
      </v-menu>
    </v-btn>
    <v-btn prepend-icon="mdi-chevron-left" :disabled="list.page < 2" @click="list.loadPrevPosts">{{
      TEXT[home.lang].PREV
    }}</v-btn>
    <v-btn
      append-icon="mdi-chevron-right"
      :disabled="list.page >= list.pageLength"
      @click="list.loadNextPosts"
      >{{ TEXT[home.lang].NEXT }}</v-btn
    >

    <v-spacer></v-spacer>
    <v-chip variant="tonal" color="blue-grey-lighten-3" v-if="home.isMobile === false"
      >{{ list.page }} / {{ list.pageLength }}
    </v-chip>
    <v-spacer v-if="home.isMobile === false"></v-spacer>

    <v-btn prepend-icon="mdi-list-box-outline" @click="list.init" v-if="home.isMobile === false">{{
      TEXT[home.lang].LIST
    }}</v-btn>
    <v-btn
      prepend-icon="mdi-pencil"
      variant="text"
      @click="util.go(util.routerName(list.config.type, ACTION_TARGET.WRITE), list.id)"
      :disabled="auth.user.uid < 1"
      >{{ TEXT[home.lang].WRITE }}</v-btn
    >
  </v-card-actions>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"
import { useBoardListStore } from "../../../store/board/list"
import { useHomeStore } from "../../../store/home"
import BoardListSearch from "./BoardListSearch.vue"
import { TEXT } from "../../../messages/pages/board/list"
import { ACTION_TARGET } from "../../../../server/database/board/const"

const auth = useAuthStore()
const list = useBoardListStore()
const util = useUtilStore()
const home = useHomeStore()
</script>
