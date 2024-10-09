<template>
  <v-btn icon @click="editor?.chain().focus().toggleBlockquote().run()" size="small"
    ><v-icon>mdi-format-quote-open</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].QUOTE }}</v-tooltip>
  </v-btn>
  <v-btn icon @click="editor?.chain().focus().setHorizontalRule().run()" size="small"
    ><v-icon>mdi-minus</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].HORIZONTAL_LINE }}</v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/vue-3"
import { TEXT } from "../../../../messages/components/board/write/board-write-editor"
import { useHomeStore } from "../../../../store/home"

const props = defineProps<{ editor: Editor }>()
const home = useHomeStore()
</script>
