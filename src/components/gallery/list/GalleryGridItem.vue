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
        :src="PREFIX + item.files[0]"
        class="align-end pointer"
        :class="{ onHover: isHovering }"
        @click="gallery.open(item.uid)"
      >
      </v-img>
      <v-card elevation="0" color="transparent" v-show="isHovering" class="status">
        <span class="icon"><v-icon>mdi-image-multiple</v-icon> {{ item.files.length }}</span>
        <span class="icon"><v-icon>mdi-heart</v-icon> {{ item.like }}</span>
        <span class="icon"><v-icon>mdi-comment-multiple-outline</v-icon> {{ item.reply }}</span>
      </v-card>
    </v-card>
  </v-hover>
</template>

<script setup lang="ts">
import { watchEffect } from "vue"
import { useGalleryStore } from "../../../store/gallery"
import { useUtilStore } from "../../../store/util"
import { GridItem } from "../../../interface/gallery"

const gallery = useGalleryStore()
const util = useUtilStore()
const PREFIX = process.env.PREFIX || ""
const props = defineProps<{
  item: GridItem
}>()

// 이미지 미리보기 크기 변경될 때 위에 나올 댓글 수 등의 숫자 위치 재조정해주기
watchEffect(() => {
  if (gallery.gridSize > 0) {
    const center = gallery.gridSize / 2
    const top = center - 25
    const left = center - 90
    const targets = document.querySelectorAll(".status")
    targets.forEach((item: any) => {
      item.style.top = `${top}px`
      item.style.left = `${left}px`
    })
  }
})
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
    padding: 10px;
  }
}
</style>
