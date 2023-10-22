<template>
  <v-app>
    <home-header></home-header>
    <v-layout>
      <v-main>
        <v-card :width="gallery.width" elevation="0" class="mx-auto gallery">
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
                <v-btn class="mr-3" prepend-icon="mdi-text-search-variant" @click=""
                  >검색
                  <v-menu activator="parent" :close-on-content-click="false">
                    <gallery-list-search></gallery-list-search>
                  </v-menu>
                </v-btn>
                <v-btn @click="load" class="ml-3 mr-3" variant="text" prepend-icon="mdi-refresh">
                  이전 사진들 불러오기
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  prepend-icon="mdi-pencil"
                  variant="text"
                  @click="gallery.upload(route.params?.id.toString())"
                  >업로드</v-btn
                >
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
    <gallery-viewer-dialog></gallery-viewer-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useRoute } from "vue-router"
import { useGalleryStore } from "../../store/gallery"
import { useViewerStore } from "../../store/gallery.viewer"
import GalleryHeader from "../../components/gallery/common/GalleryHeader.vue"
import GalleryGridItem from "../../components/gallery/list/GalleryGridItem.vue"
import GalleryListSearch from "../../components/gallery/list/GalleryListSearch.vue"
import GalleryViewerDialog from "../../components/gallery/view/GalleryViewerDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"

const route = useRoute()
const gallery = useGalleryStore()
const viewer = useViewerStore()
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

// 뷰어가 필요할 때 열어주기
watch(
  () => route.params?.no?.toString(),
  (value: string) => {
    const no = parseInt(value)
    if (no > 0) {
      viewer.dialog = true
    }
  },
)

// 이전 게시글 가져오기
function load(): void {
  // lastUid.value
}
</script>

<style scoped>
.gallery {
  margin-top: 80px;
}
</style>
