<template>
  <v-list-item class="pa-0 pl-3 pb-2"
    >{{ util.unescape(viewer.post.title) }}
    <template v-slot:append>
      <v-btn icon @click="viewer.close" elevation="0"
        ><v-icon>mdi-close</v-icon>
        <v-tooltip activator="parent">{{ TEXT[home.lang].CLOSE_TOOLTIP }}</v-tooltip>
      </v-btn>
    </template>
  </v-list-item>

  <v-divider></v-divider>

  <v-list-item class="pa-0 pl-3 pr-3 text-right">
    <template v-slot:prepend>
      <span class="text-caption">{{ util.date(viewer.post.submitted) }}</span>
      <span v-if="viewer.post.modified > 0" class="pl-2 ml-2 mr-2 text-caption">{{
        util.date(viewer.post.modified)
      }}</span>
      <v-divider vertical class="ml-3 mr-3"></v-divider>
      <span class="text-caption">{{ util.num(viewer.post.hit) }}</span>
    </template>

    <template v-slot:append>
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
    </template>
  </v-list-item>
  <v-divider></v-divider>

  <v-list-item class="pt-2 pb-2">
    <gallery-viewer-sidebar-exif v-if="showExif"></gallery-viewer-sidebar-exif>
    <v-card elevation="0" rounded="0" :color="home.isMobile ? viewer.mobileColor : ''">
      <v-card-text class="pa-0 pt-2" v-html="viewer.post.content"></v-card-text>
    </v-card>
  </v-list-item>

  <v-list-item class="pt-2 pb-2" v-if="viewer.images[viewer.position]?.description">
    <v-card elevation="0" variant="tonal" color="blue-grey">
      <v-card-title><v-icon>mdi-robot-excited-outline</v-icon></v-card-title>
      <v-card-text>{{ viewer.images[viewer.position]?.description }}</v-card-text></v-card
    >
  </v-list-item>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useBoardViewStore } from "../../../../store/board/view"
import { useViewerStore } from "../../../../store/board/gallery/viewer"
import { useHomeStore } from "../../../../store/home"
import { useUtilStore } from "../../../../store/util"
import GalleryViewerSidebarExif from "./GalleryViewerSidebarExif.vue"
import UserNametag from "../../../user/UserNametag.vue"
import { TEXT } from "../../../../messages/components/gallery/viewer/gallery-viewer"

const view = useBoardViewStore()
const viewer = useViewerStore()
const home = useHomeStore()
const util = useUtilStore()
const showExif = ref<boolean>(false)
</script>
