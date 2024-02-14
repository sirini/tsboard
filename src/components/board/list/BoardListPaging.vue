<template>
  <v-card-actions class="mt-3 mb-3">
    <v-btn prepend-icon="mdi-chevron-left" :disabled="list.page < 2" @click="list.page -= 1"
      >이전</v-btn
    >
    <v-btn
      append-icon="mdi-chevron-right"
      :disabled="list.page >= list.pageLength"
      @click="list.page += 1"
      >다음</v-btn
    >
    <v-spacer></v-spacer>
    <v-chip variant="tonal" color="blue-grey-lighten-3"
      >{{ list.page }} / {{ list.pageLength }}
    </v-chip>
    <v-spacer></v-spacer>
    <v-btn prepend-icon="mdi-magnify"
      >검색하기
      <v-menu activator="parent" :close-on-content-click="false">
        <board-list-search></board-list-search>
      </v-menu>
    </v-btn>
    <v-btn prepend-icon="mdi-pencil" variant="text" @click="util.go('boardWrite', list.id)"
      >새글쓰기</v-btn
    >
  </v-card-actions>
</template>

<script setup lang="ts">
import { useUtilStore } from "../../../store/util"
import { useBoardListStore } from "../../../store/board/list"
import BoardListSearch from "./BoardListSearch.vue"

const list = useBoardListStore()
const util = useUtilStore()
</script>
