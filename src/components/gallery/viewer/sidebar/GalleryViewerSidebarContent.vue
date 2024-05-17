<template>
  <v-list-item class="pt-2 pb-2" :prepend-avatar="viewer.post.writer.profile || '/no-profile.svg'">
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
    <gallery-viewer-sidebar-exif v-if="showExif"></gallery-viewer-sidebar-exif>
    <v-card elevation="0" rounded="0" :color="home.isMobile ? viewer.mobileColor : ''">
      <v-card-text class="pa-0 pt-2" v-html="viewer.post.content"></v-card-text>
    </v-card>
  </v-list-item>

  <v-list-item class="pt-2 pb-2" v-if="viewer.descriptions[viewer.position]">
    <v-card elevation="0" variant="tonal" color="blue-grey" class="mt-2 mb-2">
      <v-card-title><v-icon>mdi-robot-excited-outline</v-icon></v-card-title>
      <v-card-text>{{ viewer.descriptions[viewer.position] }}</v-card-text></v-card
    >
  </v-list-item>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useViewerStore } from "../../../../store/board/gallery/viewer"
import { useHomeStore } from "../../../../store/home"
import { useUtilStore } from "../../../../store/util"
import GalleryViewerSidebarExif from "./GalleryViewerSidebarExif.vue"

const viewer = useViewerStore()
const home = useHomeStore()
const util = useUtilStore()
const showExif = ref<boolean>(false)
</script>
