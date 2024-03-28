<template>
  <v-list-item class="pa-0">
    <v-text-field
      v-model="editor.category.name"
      variant="outlined"
      hide-details
      readonly
      prepend-icon="mdi-filter"
      append-inner-icon="mdi-chevron-down"
      placeholder="카테고리를 선택해주세요."
      @click="isOpenMenu = !isOpenMenu"
    >
      <v-menu v-model="isOpenMenu" activator="parent" open-on-hover>
        <v-list>
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
  </v-list-item>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useBoardEditorStore } from "../../../store/board/editor"

const editor = useBoardEditorStore()
const isOpenMenu = ref<boolean>(false)
</script>
