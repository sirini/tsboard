<template>
  <v-card max-width="500">
    <v-list>
      <v-list-item>
        <v-btn-toggle v-model="gallery.option" size="small" group>
          <v-btn :value="SEARCH_OPTION.TITLE as SearchOption">{{
            TEXT[home.lang].PHOTO_TITLE
          }}</v-btn>
          <v-btn :value="SEARCH_OPTION.CONTENT as SearchOption">{{
            TEXT[home.lang].CONTENT
          }}</v-btn>
          <v-btn :value="SEARCH_OPTION.WRITER as SearchOption">{{
            TEXT[home.lang].PHOTOGRAPHER
          }}</v-btn>
          <v-btn :value="SEARCH_OPTION.TAG as SearchOption">{{ TEXT[home.lang].TAG }}</v-btn>
        </v-btn-toggle>
      </v-list-item>

      <v-list-item>
        <v-text-field
          v-model="gallery.keyword"
          class="mt-2"
          variant="outlined"
          :placeholder="TEXT[home.lang].FILL_SEARCH"
          :rules="textRule"
          append-inner-icon="mdi-magnify"
          prepend-inner-icon="mdi-restore"
          @click:prepend-inner="gallery.resetSearchKeyword"
          @click:append-inner="gallery.search"
          @keyup.enter="gallery.search"
        ></v-text-field>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { SEARCH_OPTION, SearchOption } from "../../../interface/board"
import { useGalleryStore } from "../../../store/board/gallery/gallery"
import { useHomeStore } from "../../../store/home"
import { TEXT } from "../../../messages/components/gallery/list/gallery-list-search"

const gallery = useGalleryStore()
const home = useHomeStore()
const textRule = [
  (value: any) => {
    if (value?.length > 1) return true
    return "검색어가 너무 짧습니다."
  },
]
</script>
