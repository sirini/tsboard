<template>
  <v-container>
    <v-card :width="gridBoxWidth" elevation="0" class="mx-auto">
      <v-row no-gutters>
        <v-col v-for="(image, index) in images" :key="index" class="d-flex child-flex mb-3" :cols="columns">
          <gallery-grid-item 
            :uid="image.uid" 
            :src="PREFIX + image.files[0]"
            :totalImage="image.files.length"
            :totalLike="image.totalLike"
            :totalComment="image.totalComment"
          ></gallery-grid-item>
        </v-col>
        <v-col class="pt-1 pl-2 pr-2 pb-4 mb-2 text-center" cols="12" v-if="images.length > 0">
          <v-btn size="large" @click="" color="primary" prepend-icon="mdi-refresh">
            이전 게시글 가져오기
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue"
import GalleryGridItem from "../../components/gallery/GalleryGridItem.vue"

const PREFIX = process.env.PREFIX || ""
const gridBoxWidth = ref<number>(1280)
const columns = ref<number>(3)
const images = ref<any>([
  { uid: 1, files: [`https://cdn.vuetifyjs.com/images/cards/docks.jpg`], totalLike: 3, totalComment: 7 },
  { uid: 2, files: [`https://cdn.vuetifyjs.com/images/cards/hotel.jpg`], totalLike: 2, totalComment: 8 },
  { uid: 3, files: [`https://cdn.vuetifyjs.com/images/cards/sunshine.jpg`], totalLike: 1, totalComment: 9 },
  { uid: 4, files: [`https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg`], totalLike: 5, totalComment: 10 },
  { uid: 5, files: [`https://cdn.vuetifyjs.com/images/carousel/sky.jpg`], totalLike: 6, totalComment: 11 },
])
</script>