<template>
  <v-card-actions class="mt-6 pa-0">
    <v-btn icon size="small">
      <v-icon>mdi-magnify</v-icon>
      <v-menu activator="parent" :close-on-content-click="false">
        <board-list-search></board-list-search>
      </v-menu>
      <v-tooltip activator="parent">{{ TEXT[home.lang].SEARCH }}</v-tooltip>
    </v-btn>
    <v-btn icon :disabled="list.page < 2" @click="list.movePrevPage" size="small">
      <v-icon>mdi-chevron-left</v-icon>
      <v-tooltip activator="parent">{{ TEXT[home.lang].PREV }}</v-tooltip>
    </v-btn>
    <v-btn icon :disabled="list.page >= list.pageLength" @click="list.moveNextPage" size="small">
      <v-icon>mdi-chevron-right</v-icon>
      <v-tooltip activator="parent">{{ TEXT[home.lang].NEXT }}</v-tooltip>
    </v-btn>

    <v-spacer></v-spacer>
    <v-chip variant="tonal" color="blue-grey-lighten-3" v-if="home.isMobile === false" size="small"
      >{{ list.page }} / {{ list.pageLength }}
    </v-chip>
    <v-spacer v-if="home.isMobile === false"></v-spacer>

    <v-btn prepend-icon="mdi-list-box-outline" @click="list.init" v-if="home.isMobile === false">{{
      TEXT[home.lang].LIST
    }}</v-btn>

    <v-btn
      prepend-icon="mdi-pencil"
      @click="util.go(util.routerName(list.config.type, ACTION_TARGET.WRITE), list.id)"
      :disabled="auth.user.uid < 1"
      color="blue-grey"
      variant="flat"
      >{{ TEXT[home.lang].WRITE }}</v-btn
    >
  </v-card-actions>
</template>

<script setup lang="ts">
import { ACTION_TARGET } from "../../../../server/database/board/const"
import { TEXT } from "../../../messages/pages/board/list"
import { useBoardListStore } from "../../../store/board/list"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"
import BoardListSearch from "./BoardListSearch.vue"

const auth = useAuthStore()
const list = useBoardListStore()
const util = useUtilStore()
const home = useHomeStore()
</script>
