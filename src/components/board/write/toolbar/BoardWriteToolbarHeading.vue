<template>
  <v-btn icon size="small"
    ><v-icon>mdi-format-header-1</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].HEADING }}</v-tooltip>
    <v-menu open-on-hover activator="parent">
      <v-list>
        <v-list-item
          @click="editor?.chain().focus().toggleHeading({ level }).run()"
          v-for="(level, index) in headingLevels"
          :key="index"
        >
          <template v-slot:prepend>
            <v-icon>mdi-format-header-{{ level }}</v-icon>
          </template>
          <v-list-item-title>H{{ level }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/vue-3"
import { TEXT } from "../../../../messages/components/board/write/board-write-editor"
import { useHomeStore } from "../../../../store/home"

const props = defineProps<{ editor: Editor }>()
const home = useHomeStore()

type Level = 1 | 2 | 3 | 4 | 5 | 6
const headingLevels: Level[] = [1, 2, 3, 4, 5, 6]
</script>
