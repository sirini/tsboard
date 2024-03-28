<template>
  <v-list-item class="pa-0">
    <v-file-input
      @change="editor.selectAttachmentFiles"
      show-size
      counter
      class="pt-3"
      accept="image/*, application/pdf, application/zip, audio/*, video/*"
      hide-details
      multiple
      variant="outlined"
      label="첨부할 파일들을 선택해 주세요"
    >
      <template v-slot:selection="{ fileNames }">
        <template v-for="fileName in fileNames" :key="fileName">
          <v-chip
            size="small"
            label
            color="blue-grey"
            prepend-icon="mdi-upload"
            class="mt-1 mr-1 mb-1"
          >
            {{ fileName }}
          </v-chip>
        </template>
      </template>
    </v-file-input>
  </v-list-item>
</template>

<script setup lang="ts">
import { useBoardEditorStore } from "../../../store/board/editor"

const editor = useBoardEditorStore()
</script>
