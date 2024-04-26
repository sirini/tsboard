<template>
  <v-list>
    <v-list-item
      class="pb-2"
      :prepend-avatar="
        viewer.post.writer.profile.length < 1
          ? `${TSBOARD.PREFIX}/no-profile.svg`
          : viewer.post.writer.profile
      "
      :title="util.unescape(viewer.post.title)"
      :subtitle="util.unescape(viewer.post.writer.name)"
    >
    </v-list-item>
    <v-divider></v-divider>

    <v-list-item class="pt-2 pb-2">
      <v-card elevation="0" rounded="0">
        <v-card-text class="pa-0 pt-2 tsboard" v-html="viewer.post.content"></v-card-text>
      </v-card>
    </v-list-item>

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
import { useUtilStore } from "../../../store/util"
import { TSBOARD } from "../../../../tsboard.config"
import GalleryViewerToolbar from "./GalleryViewerToolbar.vue"
import GalleryViewerSidebarThumbnails from "./sidebar/GalleryViewerSidebarThumbnails.vue"
import GalleryViewerSidebarTag from "./sidebar/GalleryViewerSidebarTag.vue"
import GalleryViewerSidebarDateWriter from "./sidebar/GalleryViewerSidebarDateWriter.vue"
import GalleryViewerSidebarComment from "./sidebar/GalleryViewerSidebarComment.vue"

const viewer = useViewerStore()
const util = useUtilStore()
</script>
