<template>
  <v-card width="350">
    <v-list>
      <v-list-item>
        <v-btn-toggle v-model="gallery.searchOption" size="small" group>
          <v-btn value="title">작품명</v-btn>
          <v-btn value="location">촬영장소</v-btn>
          <v-btn value="hashtag">해시태그</v-btn>
          <v-btn value="photographer">작가명</v-btn>
        </v-btn-toggle>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="gallery.searchValue"
          class="mt-2"
          variant="outlined"
          placeholder="검색할 내용을 입력하세요"
          :rules="rule"
        ></v-text-field>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useGalleryStore } from "../../../store/gallery"

const gallery = useGalleryStore()
const rule = [
  (value: any) => {
    if (value.length > 1) return true
    return "검색어는 2글자 이상 입력해 주세요."
  },
]
</script>
