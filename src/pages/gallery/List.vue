<template>
  <v-card :width="gallery.width" elevation="0" class="mx-auto">
    <gallery-header></gallery-header>
    <v-row no-gutters>
      <v-col
        v-for="(image, index) in images"
        :key="index"
        class="d-flex child-flex mb-2"
        :cols="gallery.cols"
      >
        <gallery-grid-item
          :uid="image.uid"
          :src="PREFIX + image.files[0]"
          :totalImage="image.files.length"
          :totalLike="image.totalLike"
          :totalComment="image.totalComment"
        ></gallery-grid-item>
      </v-col>
      <v-col class="pt-1 pl-2 pr-2 pb-4 mb-2 text-center" cols="12" v-if="images.length > 0">
        <v-card-actions class="pa-0">
          <v-btn class="mr-3" prepend-icon="mdi-text-search-variant" @click="">검색</v-btn>
          <v-divider></v-divider>
          <v-btn @click="load" class="ml-3 mr-3" variant="text" prepend-icon="mdi-refresh">
            이전 사진들 불러오기
          </v-btn>
          <v-divider></v-divider>
          <v-btn class="ml-3" prepend-icon="mdi-cog-outline" @click="">관리</v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useGalleryStore } from "../../store/gallery"
import GalleryHeader from "../../components/gallery/GalleryHeader.vue"
import GalleryGridItem from "../../components/gallery/GalleryGridItem.vue"

const route = useRoute()
const gallery = useGalleryStore()
const PREFIX = process.env.PREFIX || ""
const images = ref<any>([
  {
    uid: 10,
    files: [`https://cdn.vuetifyjs.com/images/cards/docks.jpg`],
    totalLike: 3,
    totalComment: 7,
  },
  {
    uid: 9,
    files: [`https://cdn.vuetifyjs.com/images/cards/hotel.jpg`],
    totalLike: 2,
    totalComment: 8,
  },
  {
    uid: 8,
    files: [`https://cdn.vuetifyjs.com/images/cards/sunshine.jpg`],
    totalLike: 1,
    totalComment: 9,
  },
  {
    uid: 7,
    files: [`https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg`],
    totalLike: 5,
    totalComment: 10,
  },
  {
    uid: 6,
    files: [`https://cdn.vuetifyjs.com/images/carousel/sky.jpg`],
    totalLike: 6,
    totalComment: 11,
  },
])
const lastUid = ref<number>(6)

// 이전 게시글 가져오기
function load(): void {
  // lastUid.value
}
</script>
