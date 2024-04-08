<template>
  <v-list :bg-color="viewer.mobileColor">
    <v-list-item class="pt-2 pb-2"
      ><strong>{{ util.unescape(viewer.post.title) }}</strong></v-list-item
    >
    <v-divider></v-divider>

    <v-list-item class="pt-2 pb-2">
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
import { useUtilStore } from "../../../store/util"
import { useViewerStore } from "../../../store/board/gallery/viewer"
import { useHomeStore } from "../../../store/home"
import { useCommentStore } from "../../../store/board/comment"
import GalleryViewerSidebarTag from "./sidebar/GalleryViewerSidebarTag.vue"
import GalleryViewerSidebarDateWriter from "./sidebar/GalleryViewerSidebarDateWriter.vue"
import GalleryViewerSidebarComment from "./sidebar/GalleryViewerSidebarComment.vue"
import BoardViewCommentWriteButton from "../../board/comment/BoardViewCommentWriteButton.vue"

const util = useUtilStore()
const comment = useCommentStore()
const viewer = useViewerStore()
const home = useHomeStore()
</script>
