<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap" id="galleryContainer">
          <v-card elevation="0" class="mx-auto">
            <gallery-header></gallery-header>
            <v-row no-gutters>
              <v-col
                v-for="(image, index) in images"
                :key="index"
                class="d-flex child-flex pr-2"
                :cols="gallery.cols"
              >
                <gallery-grid-item :item="image"></gallery-grid-item>
              </v-col>
              <v-col
                class="pt-1 pl-2 pr-2 pb-4 mb-2 text-center"
                cols="12"
                v-if="images.length > 0"
              >
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
                    prepend-icon="mdi-upload"
                    variant="text"
                    @click="util.go('galleryUpload', gallery.id)"
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
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { useGalleryStore } from "../../store/gallery"
import { useUtilStore } from "../../store/util"
import { useViewerStore } from "../../store/viewer"
import { useHomeStore } from "../../store/home"
import { GridItem } from "../../interface/gallery"
import GalleryHeader from "../../components/gallery/common/GalleryHeader.vue"
import GalleryGridItem from "../../components/gallery/list/GalleryGridItem.vue"
import GalleryListSearch from "../../components/gallery/list/GalleryListSearch.vue"
import GalleryViewerDialog from "../../components/gallery/view/GalleryViewerDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import SideDrawer from "../home/SideDrawer.vue"

const gallery = useGalleryStore()
const util = useUtilStore()
const viewer = useViewerStore()
const home = useHomeStore()
const PREFIX = process.env.PREFIX || ""

onMounted(() => {
  home.color = "blue-grey-lighten-5"
  home.footerColor = "blue-grey-lighten-5"
  setGalleryItemWidth()
  window.addEventListener("resize", setGalleryItemWidth)
})

// 이미지 미리보기 크기를 컨테이너에 맞춰서 조정해주기
function setGalleryItemWidth(): void {
  const div = document.querySelector("#galleryContainer")
  if (!div) {
    return
  }
  const rect = div.getBoundingClientRect()
  gallery.gridSize = rect.width / (12 / gallery.cols)
}

const images = ref<GridItem[]>([
  {
    uid: 10,
    writer: {
      uid: 7,
      name: "일지매",
      profile: "/no-profile.png",
    },
    files: [`https://cdn.vuetifyjs.com/images/cards/docks.jpg`],
    like: 1,
    reply: 1,
  },
  {
    uid: 10,
    writer: {
      uid: 7,
      name: "일지매",
      profile: "/no-profile.png",
    },
    files: [`https://cdn.vuetifyjs.com/images/cards/hotel.jpg`],
    like: 3,
    reply: 7,
  },
  {
    uid: 10,
    writer: {
      uid: 7,
      name: "수사반장",
      profile: "/no-profile.png",
    },
    files: [`https://cdn.vuetifyjs.com/images/cards/sunshine.jpg`],
    like: 2,
    reply: 2,
  },
  {
    uid: 8,
    writer: {
      uid: 5,
      name: "김흥부",
      profile: "/no-profile.png",
    },
    files: [`https://cdn.vuetifyjs.com/images/cards/cooking.png`],
    like: 4,
    reply: 1,
  },
  {
    uid: 10,
    writer: {
      uid: 7,
      name: "홍길동",
      profile: "/no-profile.png",
    },
    files: [`https://cdn.vuetifyjs.com/images/cards/sky.jpg`],
    like: 2,
    reply: 8,
  },
])
const lastUid = ref<number>(6)

// 뷰어가 필요할 때 열어주기
watch(
  () => gallery.id,
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
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
</style>
