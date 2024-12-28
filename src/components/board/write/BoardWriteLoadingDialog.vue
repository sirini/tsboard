<template>
  <v-dialog v-model="editor.loading" max-width="320" persistent>
    <v-list class="py-2" :bg-color="COLOR.HOME.MAIN" elevation="12" rounded="xl">
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
import { COLOR } from "../../../../tsboard.config"

const editor = useBoardEditorStore()
const home = useHomeStore()
</script>
