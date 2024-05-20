<template>
  <v-dialog v-model="editor.loading" max-width="320" persistent>
    <v-list class="py-2" bg-color="blue-grey-darken-4" elevation="12" rounded="lg">
      <v-list-item>
        {{ TEXT[home.lang].WAIT }}
        <template v-slot:append>
          <v-progress-circular
            color="white"
            indeterminate="disable-shrink"
            size="16"
            width="2"
          ></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>

<script setup lang="ts">
import { useBoardEditorStore } from "../../../store/board/editor"
import { useHomeStore } from "../../../store/home"
import { TEXT } from "../../../messages/pages/board/write"

const editor = useBoardEditorStore()
const home = useHomeStore()
</script>
