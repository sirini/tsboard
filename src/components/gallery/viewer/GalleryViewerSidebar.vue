<template>
  <v-list>
    <gallery-viewer-sidebar-content></gallery-viewer-sidebar-content>
    <gallery-viewer-sidebar-thumbnails></gallery-viewer-sidebar-thumbnails>
    <gallery-viewer-sidebar-tag></gallery-viewer-sidebar-tag>
    <gallery-viewer-sidebar-date-writer></gallery-viewer-sidebar-date-writer>
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
import { useViewerStore } from "../../../store/board/gallery/viewer"
import GalleryViewerToolbar from "./GalleryViewerToolbar.vue"
import GalleryViewerSidebarThumbnails from "./sidebar/GalleryViewerSidebarThumbnails.vue"
import GalleryViewerSidebarTag from "./sidebar/GalleryViewerSidebarTag.vue"
import GalleryViewerSidebarDateWriter from "./sidebar/GalleryViewerSidebarDateWriter.vue"
import GalleryViewerSidebarComment from "./sidebar/GalleryViewerSidebarComment.vue"
import GalleryViewerSidebarContent from "./sidebar/GalleryViewerSidebarContent.vue"

const viewer = useViewerStore()
</script>
