<template>
  <v-btn icon size="small">
    <v-icon>mdi-table</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].TABLE }}</v-tooltip>
    <v-menu open-on-hover activator="parent">
      <v-list density="compact">
        <v-list-item prepend-icon="mdi-table-plus" @click="writeEditor.addTableDialog = true">{{
          TEXT[home.lang].ADD_TABLE
        }}</v-list-item>
        <v-list-item
          prepend-icon="mdi-table-column-plus-before"
          @click="editor?.chain().focus().addColumnBefore().run()"
          >{{ TEXT[home.lang].ADD_BEFORE_COLUMN }}</v-list-item
        >
        <v-list-item
          prepend-icon="mdi-table-column-plus-after"
          @click="editor?.chain().focus().addColumnAfter().run()"
          >{{ TEXT[home.lang].ADD_AFTER_COLUMN }}</v-list-item
        >
        <v-list-item
          prepend-icon="mdi-table-column-remove"
          @click="editor?.chain().focus().deleteColumn().run()"
        >
          {{ TEXT[home.lang].REMOVE_COLUMN }}
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-table-row-plus-before"
          @click="editor?.chain().focus().addRowBefore().run()"
        >
          {{ TEXT[home.lang].ADD_BEFORE_ROW }}
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-table-row-plus-after"
          @click="editor?.chain().focus().addRowAfter().run()"
        >
          {{ TEXT[home.lang].ADD_AFTER_ROW }}
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-table-row-remove"
          @click="editor?.chain().focus().deleteRow().run()"
        >
          {{ TEXT[home.lang].REMOVE_ROW }}
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-table-remove"
          @click="editor?.chain().focus().deleteTable().run()"
        >
          {{ TEXT[home.lang].REMOVE_TABLE }}
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-table-merge-cells"
          @click="editor?.chain().focus().mergeCells().run()"
        >
          {{ TEXT[home.lang].MERGE_CELL }}
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-table-split-cell"
          @click="editor?.chain().focus().splitCell().run()"
        >
          {{ TEXT[home.lang].SPLIT_CELL }}
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-table-edit"
          @click="editor?.chain().focus().toggleHeaderCell().run()"
        >
          {{ TEXT[home.lang].TOGGLE_HEADER_CELL }}
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/vue-3"
import { TEXT } from "../../../../messages/components/board/write/board-write-editor"
import { useBoardEditorStore } from "../../../../store/board/editor"
import { useHomeStore } from "../../../../store/home"

const props = defineProps<{ editor: Editor }>()
const home = useHomeStore()
const writeEditor = useBoardEditorStore()
</script>
