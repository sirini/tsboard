<template>
  <v-card max-width="500">
    <v-list>
      <v-list-item>
        <v-btn-toggle v-model="gallery.option" size="small" group>
          <v-btn :value="SEARCH_OPTION.TITLE">{{ TEXT[home.lang].PHOTO_TITLE }}</v-btn>
          <v-btn :value="SEARCH_OPTION.CONTENT">{{ TEXT[home.lang].CONTENT }}</v-btn>
          <v-btn :value="SEARCH_OPTION.WRITER">{{ TEXT[home.lang].PHOTOGRAPHER }}</v-btn>
          <v-btn :value="SEARCH_OPTION.TAG">{{ TEXT[home.lang].TAG }}</v-btn>
        </v-btn-toggle>
      </v-list-item>

      <v-list-item>
        <v-text-field
          v-model="gallery.keyword"
          class="mt-2"
          variant="outlined"
          :placeholder="TEXT[home.lang].FILL_SEARCH"
          append-inner-icon="mdi-magnify"
          prepend-inner-icon="mdi-restore"
          @click:prepend-inner="gallery.resetSearchKeyword"
          @click:append-inner="gallery.enterSearchKeyword"
          @keydown.enter="gallery.enterSearchKeyword"
        >
          <v-menu activator="parent">
            <v-list v-show="gallery.keywordHistories.length > 0">
              <v-list-item
                v-for="(keyword, index) in gallery.keywordHistories"
                :key="index"
                prepend-icon="mdi-history"
                @click="gallery.selectKeywordFromHistory(keyword)"
                >{{ keyword }}</v-list-item
              >
            </v-list>
          </v-menu>
        </v-text-field>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useGalleryStore } from "../../../store/board/gallery/gallery"
import { useHomeStore } from "../../../store/home"
import { SEARCH_OPTION } from "../../../../server/database/board/const"
import { TEXT } from "../../../messages/components/gallery/list/gallery-list-search"

const gallery = useGalleryStore()
const home = useHomeStore()
</script>
