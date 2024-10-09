<template>
  <v-btn icon @click="editor?.chain().focus().toggleBold().run()" size="small"
    ><v-icon>mdi-format-bold</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].BOLD }}</v-tooltip>
  </v-btn>
  <v-btn icon @click="editor?.chain().focus().toggleItalic().run()" size="small"
    ><v-icon>mdi-format-italic</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].ITALIC }}</v-tooltip>
  </v-btn>
  <v-btn icon @click="editor?.chain().focus().toggleStrike().run()" size="small"
    ><v-icon>mdi-format-strikethrough-variant</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].STRIKE }}</v-tooltip>
  </v-btn>
  <v-btn icon @click="editor?.chain().focus().toggleHighlight().run()" size="small"
    ><v-icon>mdi-format-color-highlight</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].HIGHLIGHT }}</v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/vue-3"
import { TEXT } from "../../../../messages/components/board/write/board-write-editor"
import { useHomeStore } from "../../../../store/home"

const props = defineProps<{ editor: Editor }>()
const home = useHomeStore()
</script>
