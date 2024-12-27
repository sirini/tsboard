<template>
  <v-list-item class="pa-0 mt-3">
    <v-text-field
      v-model="editor.tag"
      :rules="editor.textRule"
      class="mt-2"
      prepend-icon="mdi-tag-multiple"
      :label="TEXT[home.lang].ADD_TAG"
      @keyup="editor.updateTagSuggestion"
      @keyup.space="editor.addTag(editor.tag)"
      @keyup.,="editor.addTag(editor.tag)"
      @keyup.enter="editor.addTag(editor.tag)"
      variant="outlined"
    >
      <v-menu activator="parent">
        <v-list v-show="editor.tag.length > 2">
          <v-list-item
            v-for="(tag, index) in editor.suggestionTags"
            :key="index"
            prepend-icon="mdi-tag-plus"
            @click="editor.addTag(tag.name)"
            >{{ tag.name }}
            <v-tooltip activator="parent"
              >{{ TEXT[home.lang].ADD_TAG_TOOLTIP }} {{ tag.name }}</v-tooltip
            >

            <template v-slot:append>
              <v-chip :color="COLOR.HOME.HEADER">{{ util.num(tag.count) }}</v-chip>
            </template>
          </v-list-item>
          <v-list-item v-show="editor.suggestionTags.length < 1 && editor.tag.length > 2">
            {{ TEXT[home.lang].NEW_TAG_TOOLTIP }} <strong>{{ editor.tag }}</strong>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-text-field>
    <v-card elevation="0" class="mt-3 mb-2" variant="text">
      <v-chip
        v-for="(tag, index) in editor.tags"
        :key="index"
        :color="COLOR.HOME.HEADER"
        @click="editor.removeTag(tag)"
        class="mt-1 ml-1"
        prepend-icon="mdi-tag-remove-outline"
        >{{ tag }}
        <v-tooltip activator="parent">{{ TEXT[home.lang].REMOVE_WHEN_CLICK }}</v-tooltip>
      </v-chip>
    </v-card>
  </v-list-item>
</template>

<script setup lang="ts">
import { COLOR } from "../../../../tsboard.config"
import { TEXT } from "../../../messages/components/board/write/board-write-editor-others"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"

const editor = useBoardEditorStore()
const util = useUtilStore()
const home = useHomeStore()
</script>
