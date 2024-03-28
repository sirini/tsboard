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
      <v-tooltip activator="parent">클릭하시면 첨부된 이 파일을 삭제합니다.</v-tooltip>
    </v-chip>
  </v-list-item>
</template>

<script setup lang="ts">
import { useBoardEditorStore } from "../../../store/board/editor"
import { useUtilStore } from "../../../store/util"

const editor = useBoardEditorStore()
const util = useUtilStore()
</script>
