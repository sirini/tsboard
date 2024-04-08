<template>
  <v-dialog v-model="view.confirmRemovePostDialog" persistent>
    <v-card width="500" class="mx-auto" color="red">
      <v-card-title><v-icon>mdi-alert</v-icon> {{ TEXT[home.lang].TITLE }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        {{ TEXT[home.lang].WARNING }}
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-cancel" @click="view.closeConfirmRemoveDialog">{{
          TEXT[home.lang].NO
        }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-trash-can" @click="view.removePost">{{
          TEXT[home.lang].YES
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useBoardViewStore } from "../../../store/board/view"
import { useHomeStore } from "../../../store/home"
import { TEXT } from "../../../messages/components/board/view/board-view-remove-post-dialog"

const view = useBoardViewStore()
const home = useHomeStore()
</script>

<style scoped>
/** 다이얼로그 배경 조정 */
.v-overlay--active {
  animation: tsboardCustomOverlay 0.5s ease-in forwards;
}
@keyframes tsboardCustomOverlay {
  from {
    backdrop-filter: blur(0px);
    background: rgba(0, 0, 0, 0);
  }
  to {
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>
