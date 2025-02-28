<template>
  <v-carousel
    :max-height="700"
    hide-delimiter-background
    show-arrows
    delimiter-icon="mdi-circle-small"
    v-if="view.images.length > 0"
  >
    <template v-slot:prev="{ props }">
      <v-btn icon @click="props.onClick" variant="tonal" size="small" v-if="view.images.length > 1"
        ><v-icon>mdi-chevron-left</v-icon></v-btn
      >
    </template>
    <template v-slot:next="{ props }">
      <v-btn icon @click="props.onClick" variant="tonal" size="small" v-if="view.images.length > 1"
        ><v-icon>mdi-chevron-right</v-icon></v-btn
      >
    </template>
    <v-carousel-item
      v-for="(img, _) in view.images"
      :src="TSBOARD.PREFIX + img.thumbnail.large"
      cover
    >
    </v-carousel-item>
  </v-carousel>
</template>

<script setup lang="ts">
import { TSBOARD } from "../../../../tsboard.config"
import { useBoardViewStore } from "../../../store/board/view"

const view = useBoardViewStore()
</script>
