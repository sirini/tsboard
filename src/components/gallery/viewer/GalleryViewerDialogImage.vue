<template>
  <v-layout>
    <v-main>
      <v-img
        class="text-right"
        :src="
          viewer.images.at(viewer.position)?.thumbnail.large ||
          `${TSBOARD.PREFIX}/image-not-found.svg`
        "
        @mousedown="viewer.mouseDown"
        @mousemove="viewer.mouseMove"
        @mouseup="viewer.mouseUp"
        @mousewheel="viewer.mouseWheel"
        @mouseleave="viewer.mouseLeave"
        id="tsboardViewerPreview"
      >
      </v-img>
      <gallery-viewer-toolbar
        :postLike="viewer.post.like"
        :postUid="viewer.post.uid"
        :writerUid="viewer.post.writer.uid"
        :liked="viewer.post.liked"
        :color="viewer.mobileColor"
        v-if="home.isMobile"
      ></gallery-viewer-toolbar>
    </v-main>

    <gallery-viewer-navigation-drawer></gallery-viewer-navigation-drawer>
  </v-layout>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../store/board/gallery/viewer"
import { useHomeStore } from "../../../store/home"
import GalleryViewerToolbar from "./GalleryViewerToolbar.vue"
import GalleryViewerNavigationDrawer from "./GalleryViewerNavigationDrawer.vue"
import { TSBOARD } from "../../../../tsboard.config"

const viewer = useViewerStore()
const home = useHomeStore()
</script>
