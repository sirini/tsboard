<template>
  <v-list :bg-color="viewer.mobileColor">
    <v-list-item
      class="pt-2 pb-2"
      :prepend-avatar="viewer.post.writer.profile || '/no-profile.svg'"
    >
      <v-list-item-title>{{ util.unescape(viewer.post.title) }}</v-list-item-title>
      <template v-slot:append v-if="viewer.exifs[viewer.position]?.width > 0">
        <v-chip
          size="small"
          label
          color="blue-grey"
          :append-icon="showExif ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          @click="showExif = !showExif"
          >EXIF</v-chip
        >
      </template>
    </v-list-item>
    <v-divider></v-divider>

    <v-list-item class="pt-2 pb-2">
      <gallery-viewer-sidebar-exif :is-mobile="true" v-if="showExif"></gallery-viewer-sidebar-exif>
      <v-card elevation="0" rounded="0" :color="viewer.mobileColor">
        <v-card-text class="pa-0 pt-2" v-html="viewer.post.content"></v-card-text>
      </v-card>
    </v-list-item>

    <gallery-viewer-sidebar-tag></gallery-viewer-sidebar-tag>
    <v-divider></v-divider>

    <gallery-viewer-sidebar-date-writer></gallery-viewer-sidebar-date-writer>
    <gallery-viewer-sidebar-comment></gallery-viewer-sidebar-comment>
    <board-view-comment-write-button></board-view-comment-write-button>
  </v-list>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useUtilStore } from "../../../store/util"
import { useViewerStore } from "../../../store/board/gallery/viewer"
import GalleryViewerSidebarTag from "./sidebar/GalleryViewerSidebarTag.vue"
import GalleryViewerSidebarDateWriter from "./sidebar/GalleryViewerSidebarDateWriter.vue"
import GalleryViewerSidebarComment from "./sidebar/GalleryViewerSidebarComment.vue"
import GalleryViewerSidebarExif from "./sidebar/GalleryViewerSidebarExif.vue"
import BoardViewCommentWriteButton from "../../board/comment/BoardViewCommentWriteButton.vue"

const util = useUtilStore()
const viewer = useViewerStore()
const showExif = ref<boolean>(false)
</script>
