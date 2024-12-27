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
      :label="TEXT[home.lang].SELECT_ATTACHMENTS"
    >
      <template v-slot:selection="{ fileNames }">
        <template v-for="fileName in fileNames" :key="fileName">
          <v-chip
            size="small"
            label
            :color="COLOR.HOME.HEADER"
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
import { COLOR } from "../../../../tsboard.config"
import { TEXT } from "../../../messages/components/board/write/board-write-editor-others"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useHomeStore } from "../../../store/home"

const editor = useBoardEditorStore()
const home = useHomeStore()
</script>
