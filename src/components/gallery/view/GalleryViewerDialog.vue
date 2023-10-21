<template>
  <v-dialog v-model="gallery.viewerDialog">
    <v-card>
      <v-layout>
        <v-main>
          <v-img
            class="text-center"
            :src="PREFIX + gallery.images.at(gallery.position)"
            @mousedown="viewer.mouseDown"
            @mousemove="viewer.mouseMove"
            @mouseup="viewer.mouseUp"
            @mousewheel="viewer.mouseWheel"
            @mouseleave="viewer.mouseLeave"
            id="tsboardViewerPreview"
          >
            <v-btn icon size="large" v-show="isVideo" @click="" id="tsboardPlayButton">
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </v-img>
        </v-main>

        <v-navigation-drawer permanent nav :width="drawerWidth" :location="drawerPosition">
          // todo ...
        </v-navigation-drawer>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useGalleryStore } from "../../../store/gallery"
import { useViewerStore } from "../../../store/gallery.viewer"

const PREFIX = process.env.PREFIX || ""
const gallery = useGalleryStore()
const viewer = useViewerStore()
const isVideo = ref<boolean>(false)
const drawerWidth = ref<number>(400)
const drawerPosition = ref<"left" | "right">("right")

gallery.images = [
  `https://cdn.vuetifyjs.com/images/cards/docks.jpg`,
  `https://cdn.vuetifyjs.com/images/cards/hotel.jpg`,
  `https://cdn.vuetifyjs.com/images/cards/sunshine.jpg`,
  `https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg`,
  `https://cdn.vuetifyjs.com/images/carousel/sky.jpg`,
]
</script>
