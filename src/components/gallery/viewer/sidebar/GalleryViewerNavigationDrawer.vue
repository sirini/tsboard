<template>
  <v-navigation-drawer
    permanent
    nav
    :width="viewer.drawerWidth"
    :location="viewer.drawerPosition"
    v-if="home.cols < TSBOARD.SCREEN.TABLET.COLS"
  >
    <gallery-viewer-sidebar></gallery-viewer-sidebar>
    <board-view-comment-write-button></board-view-comment-write-button>

    <v-list>
      <v-list-item class="pa-0 ml-2 mr-2">
        <v-btn block @click="viewer.close" variant="tonal">{{ TEXT[home.lang].CLOSE }}</v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../../store/board/gallery/viewer"
import { useHomeStore } from "../../../../store/home"
import { TSBOARD } from "../../../../../tsboard.config"
import { TEXT } from "../../../../messages/components/gallery/viewer/gallery-viewer"
import GalleryViewerSidebar from "../GalleryViewerSidebar.vue"
import BoardViewCommentWriteButton from "../../../../components/board/comment/BoardViewCommentWriteButton.vue"

const viewer = useViewerStore()
const home = useHomeStore()
</script>
