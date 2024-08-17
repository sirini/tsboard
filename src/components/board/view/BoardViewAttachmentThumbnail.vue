<template>
  <div class="pa-6" v-if="view.images.length > 0">
    <v-row>
      <v-col :cols="home.cols" v-for="(image, index) in view.images" :key="index">
        <v-card elevation="0" @click="view.openPreviewDialog(TSBOARD.PREFIX + image.file.path)">
          <v-img cover :src="TSBOARD.PREFIX + image.thumbnail.small"></v-img>
          <v-card-text class="description pa-3" v-if="view.images[index].description.length > 0">{{
            view.images[index].description
          }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <v-divider v-if="view.images.length > 0"></v-divider>
</template>

<script setup lang="ts">
import { TSBOARD } from "../../../../tsboard.config"
import { useBoardViewStore } from "../../../store/board/view"
import { useHomeStore } from "../../../store/home"

const view = useBoardViewStore()
const home = useHomeStore()
</script>

<style scoped>
.description {
  background-color: #f8fafb;
  line-height: 1.6em;
}
</style>
