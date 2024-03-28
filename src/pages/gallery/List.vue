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
                <gallery-grid-item :item="image"></gallery-grid-item>
              </v-col>

              <v-col v-if="gallery.images.length < 1" class="text-center mt-12 mb-12">
                <v-icon>mdi-information</v-icon> 아직 올려진 사진이 없거나, 목록을 볼 수 있는 권한이
                없습니다.
              </v-col>
            </v-row>

            <v-divider class="mt-6"></v-divider>

            <gallery-list-paging></gallery-list-paging>
          </v-card>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>

    <gallery-viewer-dialog></gallery-viewer-dialog>
    <board-view-remove-post-dialog></board-view-remove-post-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useGalleryStore } from "../../store/board/gallery/gallery"
import { useViewerStore } from "../../store/board/gallery/viewer"
import { useHomeStore } from "../../store/home"
import GalleryHeader from "../../components/gallery/common/GalleryHeader.vue"
import GalleryGridItem from "../../components/gallery/list/GalleryGridItem.vue"
import GalleryListPaging from "../../components/gallery/list/GalleryListPaging.vue"
import GalleryViewerDialog from "../../components/gallery/viewer/GalleryViewerDialog.vue"
import BoardViewRemovePostDialog from "../../components/board/view/BoardViewRemovePostDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import SideDrawer from "../home/SideDrawer.vue"

const route = useRoute()
const gallery = useGalleryStore()
const viewer = useViewerStore()
const home = useHomeStore()

// 뷰어 띄우기
function openViewerDialog(): void {
  const no = parseInt(route.params?.no as string)
  if (no > 0) {
    viewer.postUid = no
    viewer.dialog = true
    gallery.images.map((image) => {
      if (image.uid === no) {
        viewer.files = image.files
        viewer.thumbnails = image.thumbnails
        return
      }
    })
  }
}

onMounted(async () => {
  await gallery.loadPhotoList()
  openViewerDialog()
  home.setGridLayout()
  gallery.gridSize = Math.floor(Math.min(gallery.config.width, home.width) / (12 / home.cols))
})

// 뷰어가 필요할 때 열어주고, 이미지 목록도 이때 전달하기
watch(
  () => route.params?.no,
  async () => {
    await gallery.loadPhotoList()
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
