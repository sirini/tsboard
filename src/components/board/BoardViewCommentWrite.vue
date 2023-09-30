<template>
  <v-card elevation="0" rounded="0" class="mt-2">
    <board-write-editor v-model="comment"></board-write-editor>
    <v-btn block append-icon="mdi-chevron-right" variant="tonal" color="primary" rounded="0"
      >댓글 작성하기</v-btn
    >
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import BoardWriteEditor from "./BoardWriteEditor.vue"

const comment = ref<string>("")
</script>
