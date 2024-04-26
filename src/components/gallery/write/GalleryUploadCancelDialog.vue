<template>
  <v-dialog v-model="gallery.confirmCancelDialog">
    <v-card :max-width="home.dialogWidth" class="mx-auto">
      <v-card-title>{{ TEXT[home.lang].TITLE }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="mb-3">
        {{ TEXT[home.lang].INFO }}
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          prepend-icon="mdi-pencil"
          color="primary"
          @click="gallery.confirmCancelDialog = false"
          >{{ TEXT[home.lang].NO }}</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-check-bold" @click="confirmCancel">{{
          TEXT[home.lang].YES
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useGalleryStore } from "../../../store/board/gallery/gallery"
import { useHomeStore } from "../../../store/home"
import { TEXT } from "../../../messages/components/board/write/gallery-upload-cancel-dialog"

const gallery = useGalleryStore()
const home = useHomeStore()
const emits = defineEmits<{
  cancel: []
}>()

// 글 작성 취소하기
function confirmCancel(): void {
  emits("cancel")
  gallery.confirmCancelDialog = false
}
</script>
