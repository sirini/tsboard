<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      class="mx-auto my-1"
      :width="gallery.gridSize"
      :elevation="isHovering ? 3 : 0"
    >
      <v-img
        cover
        :height="gallery.gridSize"
        aspect-ratio="1/1"
        :src="item.thumbnails[0] || `${TSBOARD.PREFIX}/image-not-found.svg`"
        class="text-center vimg"
        :class="{ onHover: isHovering }"
        @click="gallery.open(item.uid)"
      >
      </v-img>
      <v-card
        elevation="0"
        color="transparent"
        v-show="isHovering"
        class="status text-center"
        width="180"
      >
        <span class="icon"><v-icon>mdi-image-multiple</v-icon> {{ item.thumbnails.length }}</span>
        <span class="icon"><v-icon>mdi-heart</v-icon> {{ item.like }}</span>
        <span class="icon"><v-icon>mdi-comment-multiple-outline</v-icon> {{ item.reply }}</span>
      </v-card>
    </v-card>
  </v-hover>
</template>

<script setup lang="ts">
import { useGalleryStore } from "../../../store/board/gallery/gallery"
import { GridItem } from "../../../interface/gallery"
import { TSBOARD } from "../../../../tsboard.config"

const gallery = useGalleryStore()
const props = defineProps<{
  item: GridItem
}>()
</script>

<style type="scss" scoped>
.vimg {
  cursor: pointer;
}
.onHover {
  background-color: black;
  opacity: 0.5;
}
.status {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .icon {
    padding: 10px;
  }
}
</style>
