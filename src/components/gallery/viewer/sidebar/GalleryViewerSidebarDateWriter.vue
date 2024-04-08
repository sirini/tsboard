<template>
  <v-list-item class="pt-2 pb-2 text-caption">
    <v-icon class="mr-2">mdi-calendar</v-icon>
    <span class="submitted">{{ util.date(viewer.post.submitted) }}</span>
    <span v-if="viewer.post.modified > 0" class="modified pl-2 ml-2 mr-2">{{
      util.date(viewer.post.modified)
    }}</span>
    <v-icon class="ml-4 mr-2">mdi-eye-outline</v-icon> {{ util.num(viewer.post.hit) }}

    <template v-slot:append>
      <user-nametag
        :uid="viewer.post.writer.uid"
        :name="viewer.post.writer.name"
        :profile="viewer.post.writer.profile"
        size="small"
      ></user-nametag>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../../store/board/gallery/viewer"
import { useUtilStore } from "../../../../store/util"
import UserNametag from "../../../user/UserNametag.vue"

const viewer = useViewerStore()
const util = useUtilStore()
</script>
