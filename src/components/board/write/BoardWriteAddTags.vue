<template>
  <v-list-item class="pa-0 mt-3">
    <v-text-field
      v-model="editor.tag"
      :rules="editor.textRule"
      class="mt-2"
      prepend-icon="mdi-tag-multiple"
      label="게시글과 어울리는 태그를 입력해 주세요 (스페이스/엔터 키 혹은 콤마 키로 추가)"
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
            <v-tooltip activator="parent"> {{ tag.name }} 태그를 추가합니다 </v-tooltip>

            <template v-slot:append>
              <v-chip color="blue-grey">{{ util.num(tag.count) }}</v-chip>
            </template>
          </v-list-item>
          <v-list-item v-show="editor.suggestionTags.length < 1 && editor.tag.length > 2">
            <strong>{{ editor.tag }}</strong> 새로운 태그입니다! 😉
          </v-list-item>
        </v-list>
      </v-menu>
    </v-text-field>
    <v-card elevation="0" class="mt-2 mb-2">
      <v-chip
        v-for="(tag, index) in editor.tags"
        :key="index"
        color="blue-grey"
        @click="editor.removeTag(tag)"
        class="mt-1 ml-1"
        prepend-icon="mdi-tag-remove-outline"
        >{{ tag }}
        <v-tooltip activator="parent">클릭하시면 삭제합니다!</v-tooltip>
      </v-chip>
    </v-card>
  </v-list-item>
</template>

<script setup lang="ts">
import { useBoardEditorStore } from "../../../store/board/editor"
import { useUtilStore } from "../../../store/util"

const editor = useBoardEditorStore()
const util = useUtilStore()
</script>
