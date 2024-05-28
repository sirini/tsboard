<template>
  <v-list-item class="pt-2 pb-2">
    <v-list-item-title>{{ util.unescape(viewer.post.title) }}</v-list-item-title>
    <v-list-item-subtitle class="mt-2">
      <user-nametag
        :uid="viewer.post.writer.uid"
        :name="viewer.post.writer.name"
        :profile="viewer.post.writer.profile"
        size="small"
      ></user-nametag>

      <v-chip
        size="small"
        color="blue-grey"
        class="ml-2"
        :append-icon="showExif ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="showExif = !showExif"
        v-if="viewer.images[viewer.position]?.exif.model.length > 0"
        >EXIF</v-chip
      >
    </v-list-item-subtitle>
  </v-list-item>
  <v-divider></v-divider>

  <v-list-item class="pt-2 pb-2">
    <gallery-viewer-sidebar-exif v-if="showExif"></gallery-viewer-sidebar-exif>
    <v-card elevation="0" rounded="0" :color="home.isMobile ? viewer.mobileColor : ''">
      <v-card-text class="pa-0 pt-2" v-html="viewer.post.content"></v-card-text>
    </v-card>
  </v-list-item>

  <v-list-item class="pt-2 pb-2" v-if="viewer.images[viewer.position]?.description">
    <v-card elevation="0" variant="tonal" color="blue-grey" class="mt-2 mb-2">
      <v-card-title><v-icon>mdi-robot-excited-outline</v-icon></v-card-title>
      <v-card-text>{{ viewer.images[viewer.position]?.description }}</v-card-text></v-card
    >
  </v-list-item>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useViewerStore } from "../../../../store/board/gallery/viewer"
import { useHomeStore } from "../../../../store/home"
import { useUtilStore } from "../../../../store/util"
import GalleryViewerSidebarExif from "./GalleryViewerSidebarExif.vue"
import UserNametag from "../../../user/UserNametag.vue"

const viewer = useViewerStore()
const home = useHomeStore()
const util = useUtilStore()
const showExif = ref<boolean>(false)
</script>
