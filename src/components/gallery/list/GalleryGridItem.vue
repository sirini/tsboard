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
        :src="PREFIX + item.files[0]"
        class="align-end pointer"
        :class="{ onHover: isHovering }"
        @click="gallery.open(route.params?.id.toString(), item.uid)"
      ></v-img>

      <v-card elevation="0" color="transparent" v-show="isHovering" class="status">
        <span class="icon"><v-icon>mdi-image-multiple</v-icon> {{ item.files.length }}</span>
        <span class="icon"><v-icon>mdi-heart</v-icon> {{ item.like }}</span>
        <span class="icon"><v-icon>mdi-comment-multiple-outline</v-icon> {{ item.reply }}</span>
      </v-card>
    </v-card>
  </v-hover>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useGalleryStore } from "../../../store/gallery"
import { GridItem } from "../../../interface/gallery"

const route = useRoute()
const gallery = useGalleryStore()
const PREFIX = process.env.PREFIX || ""
const props = defineProps<{
  item: GridItem
}>()
</script>

<style type="scss" scoped>
.pointer {
  cursor: pointer;
}
.onHover {
  background-color: black;
  opacity: 0.5;
}
.status {
  position: absolute;
  top: 120px;
  left: 50px;

  .icon {
    padding: 15px;
  }
}
</style>
