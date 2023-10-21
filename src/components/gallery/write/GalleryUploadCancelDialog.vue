<template>
  <v-dialog width="500" v-model="gallery.confirmCancelDialog">
    <v-card>
      <v-card-title>확인</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="mb-3">
        작성중이신 내용을 모두 잃게 됩니다. 계속 진행하시겠습니까?
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          prepend-icon="mdi-pencil"
          color="primary"
          @click="gallery.confirmCancelDialog = false"
          >아니요, 계속 작성하겠습니다</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-check-bold" @click="confirmCancel">예</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useGalleryStore } from "../../../store/gallery"

const gallery = useGalleryStore()
const emit = defineEmits(["cancel"])

// 글 작성 취소하기
function confirmCancel(): void {
  emit("cancel")
  gallery.confirmCancelDialog = false
}
</script>
