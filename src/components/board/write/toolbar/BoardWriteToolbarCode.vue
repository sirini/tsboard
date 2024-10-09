<template>
  <v-btn icon @click="editor?.chain().focus().toggleCode().run()" size="small"
    ><v-icon>mdi-code-braces</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].CODE_LINE }}</v-tooltip>
  </v-btn>
  <v-btn icon @click="editor?.chain().focus().toggleCodeBlock().run()" size="small"
    ><v-icon>mdi-code-braces-box</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].CODE_BLOCK }}</v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/vue-3"
import { TEXT } from "../../../../messages/components/board/write/board-write-editor"
import { useHomeStore } from "../../../../store/home"

const props = defineProps<{ editor: Editor }>()
const home = useHomeStore()
</script>
