<template>
  <v-card :max-width="home.dialogWidth" rounded="xl">
    <v-list>
      <v-list-item>
        <v-btn-toggle v-model="gallery.option" size="small" group rounded="pill">
          <v-btn :value="SEARCH.TITLE">{{ TEXT[home.lang].PHOTO_TITLE }}</v-btn>
          <v-btn :value="SEARCH.CONTENT">{{ TEXT[home.lang].CONTENT }}</v-btn>
          <v-btn :value="SEARCH.WRITER">{{ TEXT[home.lang].PHOTOGRAPHER }}</v-btn>
          <v-btn :value="SEARCH.TAG">{{ TEXT[home.lang].TAG }}</v-btn>
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
          hide-details
          rounded="pill"
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
import { useGalleryStore } from "../../../store/board/gallery"
import { useHomeStore } from "../../../store/home"
import { TEXT } from "../../../messages/components/gallery/list/gallery-list-search"
import { SEARCH } from "../../../interface/board_interface"

const gallery = useGalleryStore()
const home = useHomeStore()
</script>
