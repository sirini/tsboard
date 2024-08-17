<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap" id="galleryContainer">
          <v-card elevation="0" class="mx-auto" :max-width="gallery.config.width">
            <gallery-header></gallery-header>

            <v-divider class="mb-6"></v-divider>

            <v-row no-gutters>
              <v-col
                v-for="(image, index) in gallery.images"
                :key="index"
                class="d-flex child-flex pl-1 pr-1"
                :cols="home.cols"
              >
                <gallery-grid-item :item="image" v-if="image.images.length > 0"></gallery-grid-item>
                <v-card v-else :width="gallery.gridSize" elevation="0" class="mt-2">
                  <v-img cover :src="TSBOARD.PREFIX + '/image-not-found.svg'"></v-img>
                </v-card>
              </v-col>

              <v-col v-if="gallery.images.length < 1" class="text-center mt-12 mb-12">
                <v-icon>mdi-information</v-icon> {{ TEXT[home.lang].EMPTY }}
              </v-col>
            </v-row>

            <v-btn
              block
              elevation="0"
              variant="text"
              class="mt-4"
              :color="home.color.header"
              @click="gallery.loadOldPhotos"
              prepend-icon="mdi-restore"
            >
              {{ TEXT[home.lang].LOAD_PREV_PHOTOS }}
            </v-btn>

            <v-divider class="mt-6"></v-divider>

            <gallery-list-paging></gallery-list-paging>
          </v-card>
        </v-container>
        <home-footer></home-footer>
        <quick-button v-if="home.isMobile"></quick-button>
      </v-main>
    </v-layout>

    <gallery-viewer-dialog></gallery-viewer-dialog>
    <board-view-remove-post-dialog></board-view-remove-post-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import { TSBOARD } from "../../../tsboard.config"
import BoardViewRemovePostDialog from "../../components/board/view/BoardViewRemovePostDialog.vue"
import GalleryHeader from "../../components/gallery/common/GalleryHeader.vue"
import GalleryGridItem from "../../components/gallery/list/GalleryGridItem.vue"
import GalleryListPaging from "../../components/gallery/list/GalleryListPaging.vue"
import GalleryViewerDialog from "../../components/gallery/viewer/GalleryViewerDialog.vue"
import { TEXT } from "../../messages/pages/gallery/list"
import { useGalleryStore } from "../../store/board/gallery/gallery"
import { useViewerStore } from "../../store/board/gallery/viewer"
import { useHomeStore } from "../../store/home"
import HomeFooter from "../home/HomeFooter.vue"
import HomeHeader from "../home/HomeHeader.vue"
import SideDrawer from "../home/SideDrawer.vue"
import QuickButton from "../home/components/mobile/QuickButton.vue"

const route = useRoute()
const gallery = useGalleryStore()
const viewer = useViewerStore()
const home = useHomeStore()

// 뷰어 띄우기
function openViewerDialog(): void {
  viewer.postUid = parseInt(route.params?.no as string)
  if (viewer.postUid > 0) {
    viewer.dialog = true
    viewer.loadPhotos()
  }
}

onMounted(async () => {
  openViewerDialog()
  gallery.resetGalleryList()
})

watch(
  () => route.params?.id,
  () => gallery.resetGalleryList(),
)

watch(
  () => route.params?.no,
  async (value) => {
    viewer.postUid = parseInt(value as string)
    if (viewer.sinceUid < 1) {
      await gallery.loadPhotoList()
    }
    openViewerDialog()
  },
)
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
</style>
