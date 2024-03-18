<template>
  <v-card width="500">
    <v-list>
      <v-list-item>
        <v-btn-toggle v-model="gallery.option" size="small" group>
          <v-btn value="title">사진명</v-btn>
          <v-btn value="content">내용</v-btn>
          <v-btn value="writer">작가명</v-btn>
          <v-btn value="tag">태그</v-btn>
        </v-btn-toggle>
      </v-list-item>

      <v-list-item>
        <v-text-field
          v-model="gallery.keyword"
          class="mt-2"
          variant="outlined"
          placeholder="검색할 내용을 입력하세요"
          :rules="textRule"
          append-inner-icon="mdi-magnify"
          prepend-inner-icon="mdi-restore"
          @click:prepend-inner="gallery.resetSearchKeyword"
          @click:append-inner="gallery.loadPhotoList"
          @keyup.enter="gallery.loadPhotoList"
        ></v-text-field>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useGalleryStore } from "../../../store/board/gallery/gallery"

const gallery = useGalleryStore()
const textRule = [
  (value: any) => {
    if (value?.length > 1) return true
    return "검색어가 너무 짧습니다."
  },
]
</script>
