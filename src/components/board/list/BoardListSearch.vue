<template>
  <v-card max-width="500">
    <v-list>
      <v-list-item>
        <v-btn-toggle v-model="list.option" size="small" group color="blue-grey">
          <v-btn :value="SEARCH_OPTION.TITLE as SearchOption">{{ TEXT[home.lang].TITLE }}</v-btn>
          <v-btn :value="SEARCH_OPTION.CONTENT as SearchOption">{{
            TEXT[home.lang].CONTENT
          }}</v-btn>
          <v-btn :value="SEARCH_OPTION.WRITER as SearchOption">{{ TEXT[home.lang].WRITER }}</v-btn>
          <v-btn :value="SEARCH_OPTION.TAG as SearchOption">{{ TEXT[home.lang].TAG }}</v-btn>
        </v-btn-toggle>
      </v-list-item>

      <v-list-item>
        <v-text-field
          v-model="list.keyword"
          class="mt-2"
          variant="outlined"
          :placeholder="TEXT[home.lang].FILL_SEARCH"
          :rules="textRule"
          append-inner-icon="mdi-magnify"
          prepend-inner-icon="mdi-restore"
          @click:prepend-inner="list.resetSearchKeyword"
          @click:append-inner="list.search"
          @keyup.enter="list.search"
        ></v-text-field>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { SearchOption } from "../../../interface/board"
import { useBoardListStore } from "../../../store/board/list"
import { useHomeStore } from "../../../store/home"
import { SEARCH_OPTION } from "../../../../server/database/board/const"
import { TEXT } from "../../../messages/pages/board/list"

const list = useBoardListStore()
const home = useHomeStore()
const textRule = [
  (value: any) => {
    if (value?.length > 1) return true
    return "검색어가 너무 짧습니다."
  },
]
</script>
