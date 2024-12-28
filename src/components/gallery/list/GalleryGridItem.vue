<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      class="mx-auto my-1"
      :width="gallery.gridSize"
      :elevation="isHovering ? 6 : 0"
      rounded="xl"
    >
      <v-img
        cover
        :height="gallery.gridSize"
        aspect-ratio="1/1"
        :src="TSBOARD.PREFIX + (item.images[0].thumbnail.large || '/image-not-found.svg')"
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
        <span class="icon"
          ><v-icon size="small">mdi-image-multiple</v-icon> {{ item.images.length }}</span
        >
        <span class="icon"
          ><v-icon size="small" :color="item.liked ? 'red' : ''">mdi-heart</v-icon>
          {{ item.like }}</span
        >
        <span class="icon"
          ><v-icon size="small">mdi-comment-multiple-outline</v-icon> {{ item.comment }}</span
        >
      </v-card>
    </v-card>
  </v-hover>
</template>

<script setup lang="ts">
import { useGalleryStore } from "../../../store/board/gallery"
import { TSBOARD } from "../../../../tsboard.config"
import { GalleryGridItem } from "../../../interface/post_interface"

const gallery = useGalleryStore()
const props = defineProps<{
  item: GalleryGridItem
}>()
</script>

<style type="scss" scoped>
.vimg {
  cursor: pointer;
}
.onHover {
  background-color: black;
  opacity: 0.3;
  transition: all 0.3s ease;
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
