<template>
  <v-card width="350">
    <v-list>
      <v-list-item>
        <v-btn-toggle v-model="util.searchOption" size="small" group>
          <v-btn value="subject">사진명</v-btn>
          <v-btn value="content">내용</v-btn>
          <v-btn value="both">사진명+내용</v-btn>
          <v-btn value="writer">작가명</v-btn>
        </v-btn-toggle>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="util.searchValue"
          class="mt-2"
          variant="outlined"
          placeholder="검색할 내용을 입력하세요"
          :rules="util.textRule"
        ></v-text-field>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useGalleryStore } from "../../../store/gallery"
import { useUtilStore } from "../../../store/util"

const gallery = useGalleryStore()
const util = useUtilStore()
</script>
