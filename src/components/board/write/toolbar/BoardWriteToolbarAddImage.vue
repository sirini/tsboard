<template>
  <v-btn icon size="small">
    <v-icon>mdi-image</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].ADD_IMAGE }}</v-tooltip>
    <v-menu open-on-hover activator="parent">
      <v-list density="compact">
        <v-list-item prepend-icon="mdi-image-plus" @click="editorImage.uploadImageDialog = true">
          {{ TEXT[home.lang].UPLOAD_IMAGE }}
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-image-search-outline"
          @click="editorImage.addImageFromDBDialog = true"
        >
          {{ TEXT[home.lang].ADD_EXIST_IMAGE }}
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-link-variant-plus"
          @click="writeEditor.addImageURLDialog = true"
        >
          {{ TEXT[home.lang].ADD_EXTERNAL_IMAGE }}
        </v-list-item>
        <v-list-item prepend-icon="mdi-youtube" @click="writeEditor.addVideoURLDialog = true">
          {{ TEXT[home.lang].ADD_YOUTUBE }}
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import { TEXT } from "../../../../messages/components/board/write/board-write-editor"
import { useBoardEditorStore } from "../../../../store/board/editor"
import { useEditorImageStore } from "../../../../store/board/image"
import { useHomeStore } from "../../../../store/home"

const home = useHomeStore()
const writeEditor = useBoardEditorStore()
const editorImage = useEditorImageStore()
</script>
