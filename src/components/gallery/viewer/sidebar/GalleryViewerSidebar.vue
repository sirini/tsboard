<template>
  <v-list>
    <gallery-viewer-sidebar-content></gallery-viewer-sidebar-content>
    <gallery-viewer-sidebar-thumbnails></gallery-viewer-sidebar-thumbnails>
    <gallery-viewer-sidebar-tag></gallery-viewer-sidebar-tag>
    <gallery-viewer-sidebar-date></gallery-viewer-sidebar-date>
    <gallery-viewer-toolbar
      :postLike="viewer.post.like"
      :postUid="viewer.post.uid"
      :writerUid="viewer.post.writer.uid"
      :liked="viewer.post.liked"
    ></gallery-viewer-toolbar>

    <gallery-viewer-sidebar-comment></gallery-viewer-sidebar-comment>
  </v-list>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../../store/board/gallery/viewer"
import GalleryViewerToolbar from "../GalleryViewerToolbar.vue"
import GalleryViewerSidebarThumbnails from "./GalleryViewerSidebarThumbnails.vue"
import GalleryViewerSidebarTag from "./GalleryViewerSidebarTag.vue"
import GalleryViewerSidebarDate from "./GalleryViewerSidebarDate.vue"
import GalleryViewerSidebarComment from "./GalleryViewerSidebarComment.vue"
import GalleryViewerSidebarContent from "./GalleryViewerSidebarContent.vue"

const viewer = useViewerStore()
</script>
