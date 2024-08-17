<template>
  <v-dialog v-model="view.previewDialog">
    <v-card>
      <v-img :src="view.previewPath" cover></v-img>
      <v-btn icon variant="tonal" class="close" @click="view.closePreviewDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useBoardViewStore } from "../../../store/board/view"

const view = useBoardViewStore()
</script>

<style scoped>
.close {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
