<template>
  <v-list-item class="pt-2 pb-2 text-caption">
    <v-icon class="mr-2">mdi-calendar</v-icon>
    <span class="submitted">{{ util.date(viewer.post.submitted) }}</span>
    <span v-if="viewer.post.modified > 0" class="modified pl-2 ml-2 mr-2">{{
      util.date(viewer.post.modified)
    }}</span>
    <v-icon class="ml-4 mr-2">mdi-eye-outline</v-icon> {{ util.num(viewer.post.hit) }}

    <template v-slot:append>
      <v-chip
        prepend-icon="mdi-download"
        size="small"
        color="blue-grey"
        @click="view.download(viewer.images[viewer.position].file.uid)"
        >{{ TEXT[home.lang].DOWNLOAD }}</v-chip
      >
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { useBoardViewStore } from "../../../../store/board/view"
import { useViewerStore } from "../../../../store/board/gallery/viewer"
import { useUtilStore } from "../../../../store/util"
import { useHomeStore } from "../../../../store/home"
import { TEXT } from "../../../../messages/components/gallery/viewer/gallery-viewer"

const view = useBoardViewStore()
const viewer = useViewerStore()
const util = useUtilStore()
const home = useHomeStore()
</script>
