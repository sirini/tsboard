<template>
  <v-btn icon @click="editor?.chain().focus().undo().run()" size="small"
    ><v-icon>mdi-arrow-u-left-top</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].UNDO }}</v-tooltip>
  </v-btn>
  <v-btn icon @click="editor?.chain().focus().redo().run()" size="small"
    ><v-icon>mdi-arrow-u-right-top</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].REDO }}</v-tooltip>
  </v-btn>
  <v-btn icon @click="editor?.chain().focus().unsetAllMarks().run()" size="small"
    ><v-icon>mdi-restore</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].UNSET }}</v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/vue-3"
import { TEXT } from "../../../../messages/components/board/write/board-write-editor"
import { useHomeStore } from "../../../../store/home"

const props = defineProps<{ editor: Editor }>()
const home = useHomeStore()
</script>
