<template>
  <v-text-field
    v-model="editor.category.name"
    variant="outlined"
    hide-details
    readonly
    prepend-inner-icon="mdi-filter"
    append-inner-icon="mdi-chevron-down"
    :placeholder="TEXT[home.lang].CHOOSE_CATEGORY"
    @click="isOpenMenu = !isOpenMenu"
    rounded="pill"
    :min-width="150"
  >
    <v-menu v-model="isOpenMenu" activator="parent" open-on-hover>
      <v-list rounded="xl">
        <v-list-item
          v-for="(cat, index) in editor.categories"
          :key="index"
          @click="editor.selectCategory(cat)"
        >
          {{ cat.name }}
        </v-list-item>
      </v-list>
    </v-menu>
  </v-text-field>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useHomeStore } from "../../../store/home"
import { TEXT } from "../../../messages/components/board/write/board-write-editor-others"

const editor = useBoardEditorStore()
const home = useHomeStore()
const isOpenMenu = ref<boolean>(false)
</script>
