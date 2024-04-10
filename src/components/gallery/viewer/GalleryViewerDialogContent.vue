<template>
  <v-card-text class="pa-0">
    <v-layout>
      <v-main>
        <gallery-viewer-sidebar-mobile-content></gallery-viewer-sidebar-mobile-content>
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
  </v-card-text>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../store/board/gallery/viewer"
import { useHomeStore } from "../../../store/home"
import GalleryViewerSidebarMobileContent from "./GalleryViewerSidebarMobileContent.vue"
import GalleryViewerToolbar from "./GalleryViewerToolbar.vue"
import GalleryViewerNavigationDrawer from "./sidebar/GalleryViewerNavigationDrawer.vue"

const viewer = useViewerStore()
const home = useHomeStore()
</script>
