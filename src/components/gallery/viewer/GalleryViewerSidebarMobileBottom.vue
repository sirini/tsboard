<template>
  <gallery-viewer-toolbar
    :postLike="viewer.post.like"
    :postUid="viewer.post.uid"
    :writerUid="viewer.post.writer.uid"
    :liked="viewer.post.liked"
    :color="viewer.mobileColor"
  ></gallery-viewer-toolbar>

  <v-list :bg-color="viewer.mobileColor">
    <v-list-item>
      <v-btn
        block
        rounded="xl"
        variant="tonal"
        elevation="0"
        @click="viewer.isViewContent = !viewer.isViewContent"
        >{{
          viewer.isViewContent ? TEXT[home.lang].VIEW_PHOTO : TEXT[home.lang].VIEW_CONTENT
        }}</v-btn
      >
    </v-list-item>
    <v-list-item>
      <v-btn block rounded="xl" variant="tonal" elevation="0" @click="viewer.close">{{
        TEXT[home.lang].CLOSE
      }}</v-btn>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../../store/home"
import { useViewerStore } from "../../../store/board/gallery/viewer"
import { TSBOARD } from "../../../../tsboard.config"
import { TEXT } from "../../../messages/components/gallery/viewer/gallery-viewer"
import GalleryViewerToolbar from "./GalleryViewerToolbar.vue"

const home = useHomeStore()
const viewer = useViewerStore()
</script>
