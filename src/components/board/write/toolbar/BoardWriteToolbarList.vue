<template>
  <v-btn icon @click="editor?.chain().focus().toggleBulletList().run()" size="small"
    ><v-icon>mdi-format-list-bulleted-type</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].UNORDER_LIST }}</v-tooltip>
  </v-btn>
  <v-btn icon @click="editor?.chain().focus().toggleOrderedList().run()" size="small"
    ><v-icon>mdi-format-list-numbered</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].ORDER_LIST }}</v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/vue-3"
import { TEXT } from "../../../../messages/components/board/write/board-write-editor"
import { useHomeStore } from "../../../../store/home"

const props = defineProps<{ editor: Editor }>()
const home = useHomeStore()
</script>
