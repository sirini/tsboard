<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card v-bind="props" class="mx-auto my-1" :width="gridSize" :elevation="isHovering ? 3 : 0">
      <v-img cover 
        :height="gridSize" 
        :src="src" 
        class="align-end pointer" 
        :class="{ onHover: isHovering }"
        @click="gallery.open(id, uid)"></v-img>

      <v-card
        elevation="0"
        color="transparent"
        v-show="isHovering"
        class="status"
      >
        <span class="icon"><v-icon>mdi-image-multiple</v-icon> {{ totalImage }}</span>
        <span class="icon"><v-icon>mdi-heart</v-icon> {{ totalLike }}</span>
        <span class="icon"><v-icon>mdi-comment-multiple-outline</v-icon> {{ totalComment }}</span>
      </v-card>
    </v-card>  
  </v-hover>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useGalleryStore } from "../../store/gallery"

const route = useRoute()
const gallery = useGalleryStore()
const PREFIX = process.env.PREFIX || ""
const id = route.params?.id.toString()
const props = defineProps<{
  uid: number
  src: string
  totalImage: number
  totalLike: number
  totalComment: number
}>()

const gridSize = ref<number>(300)
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
  top: 130px;
  left: 50px;

  .icon {
    padding: 15px;
  }
}
</style>