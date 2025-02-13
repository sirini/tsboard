<template>
  <v-app :style="bgColor" :theme="COLOR.GALLERY.THEME">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap" id="galleryContainer">
          <gallery-header :config="gallery.config"></gallery-header>

          <v-card class="mx-auto pa-3 mt-5" :max-width="gallery.config.width" rounded="xl">
            <v-row no-gutters>
              <v-col
                v-for="(image, index) in gallery.images"
                :key="index"
                class="d-flex child-flex pl-1 pr-1"
                :cols="home.cols"
              >
                <gallery-grid-item
                  :item="image"
                  v-if="image.images[0].file.uid > 0"
                ></gallery-grid-item>
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
              variant="tonal"
              class="mt-4"
              :color="COLOR.HOME.MAIN"
              @click="gallery.loadOldPhotos"
              prepend-icon="mdi-download"
              rounded="pill"
            >
              {{ TEXT[home.lang].LOAD_PREV_PHOTOS }} [{{ gallery.page }}/{{ gallery.pageLength }}]
            </v-btn>

            <v-divider class="mt-6"></v-divider>

            <gallery-list-paging></gallery-list-paging>
          </v-card>
        </v-container>
        <home-footer></home-footer>
        <quick-button v-if="home.isMobile"></quick-button>
      </v-main>
      <side-notification-drawer></side-notification-drawer>
    </v-layout>

    <gallery-viewer-dialog></gallery-viewer-dialog>
    <board-view-remove-post-dialog></board-view-remove-post-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import { COLOR, TSBOARD } from "../../../tsboard.config"
import BoardViewRemovePostDialog from "../../components/board/view/BoardViewRemovePostDialog.vue"
import GalleryHeader from "../../components/gallery/common/GalleryHeader.vue"
import GalleryGridItem from "../../components/gallery/list/GalleryGridItem.vue"
import GalleryListPaging from "../../components/gallery/list/GalleryListPaging.vue"
import GalleryViewerDialog from "../../components/gallery/viewer/GalleryViewerDialog.vue"
import { TEXT } from "../../messages/pages/gallery/list"
import { useGalleryStore } from "../../store/board/gallery"
import { useViewerStore } from "../../store/board/gallery.viewer"
import { useHomeStore } from "../../store/home"
import HomeFooter from "../home/HomeFooter.vue"
import HomeHeader from "../home/HomeHeader.vue"
import SideDrawer from "../home/SideDrawer.vue"
import SideNotificationDrawer from "../home/SideNotificationDrawer.vue"
import QuickButton from "../home/components/mobile/QuickButton.vue"

const route = useRoute()
const gallery = useGalleryStore()
const viewer = useViewerStore()
const home = useHomeStore()
const bgColor = `background-color: ${COLOR.HOME.BACKGROUND}`

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
  min-height: calc(100vh - 130px);
}
</style>
