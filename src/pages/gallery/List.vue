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
            <v-row no-gutters>
              <v-col class="pt-1 pl-2 pr-2 pb-4 mb-2 text-center">
                <v-card-actions class="pa-0">
                  <v-btn class="mr-3" prepend-icon="mdi-text-search-variant"
                    >검색
                    <v-menu activator="parent" :close-on-content-click="false">
                      <gallery-list-search></gallery-list-search>
                    </v-menu>
                  </v-btn>
                  <v-btn
                    @click="gallery.loadOldPhotos"
                    class="ml-3 mr-3"
                    variant="text"
                    prepend-icon="mdi-refresh"
                  >
                    이전 사진들 불러오기
                  </v-btn>

                  <v-spacer></v-spacer>
                  <v-chip variant="tonal" color="blue-grey-lighten-3">
                    {{ gallery.page }} / {{ gallery.pageLength }}
                  </v-chip>
                  <v-spacer></v-spacer>

                  <v-btn
                    prepend-icon="mdi-list-box-outline"
                    class="ml-3 mr-3"
                    variant="text"
                    @click="util.go('galleryList', gallery.id)"
                    >목록보기</v-btn
                  >
                  <v-btn
                    prepend-icon="mdi-upload"
                    variant="text"
                    @click="util.go('boardWrite', gallery.id)"
                    :disabled="auth.user.uid < 1"
                    >업로드</v-btn
                  >
                </v-card-actions>
              </v-col>
            </v-row>
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
import { useAuthStore } from "../../store/user/auth"
import { useUtilStore } from "../../store/util"
import { useViewerStore } from "../../store/board/gallery/viewer"
import { useHomeStore } from "../../store/home"
import GalleryHeader from "../../components/gallery/common/GalleryHeader.vue"
import GalleryGridItem from "../../components/gallery/list/GalleryGridItem.vue"
import GalleryListSearch from "../../components/gallery/list/GalleryListSearch.vue"
import GalleryViewerDialog from "../../components/gallery/viewer/GalleryViewerDialog.vue"
import BoardViewRemovePostDialog from "../../components/board/view/BoardViewRemovePostDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import SideDrawer from "../home/SideDrawer.vue"

const route = useRoute()
const gallery = useGalleryStore()
const auth = useAuthStore()
const util = useUtilStore()
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
  gallery.gridSize = Math.floor(gallery.config.width / (12 / home.cols))
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
