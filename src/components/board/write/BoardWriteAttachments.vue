<template>
  <v-list-item class="pa-0 pl-10">
    <v-chip
      size="small"
      label
      color="warning"
      prepend-icon="mdi-file-remove-outline"
      class="mt-1 mr-1 mb-1"
      @click="editor.removeAttachedFile(file.uid)"
      v-for="(file, index) in editor.attachedFiles"
      :key="index"
      >{{ file.name }} ({{ util.num(file.size) }})
      <v-tooltip activator="parent">{{ TEXT[home.lang].REMOVE_WHEN_CLICK }}</v-tooltip>
    </v-chip>
  </v-list-item>
</template>

<script setup lang="ts">
import { useBoardEditorStore } from "../../../store/board/editor"
import { useUtilStore } from "../../../store/util"
import { useHomeStore } from "../../../store/home"
import { TEXT } from "../../../messages/components/board/write/board-write-editor-others"

const editor = useBoardEditorStore()
const util = useUtilStore()
const home = useHomeStore()
</script>
