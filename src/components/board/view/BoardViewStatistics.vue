<template>
  <v-list-item class="view_info underline">
    <template v-slot:prepend>
      <span class="mr-4 text-caption" v-if="view.config.useCategory"
        ><v-icon size="small" class="mr-2">mdi-filter-outline</v-icon>
        {{ view.post.category.name }}</span
      >
      <v-divider vertical v-if="view.config.useCategory" class="mr-4"></v-divider>

      <span class="mr-4 text-caption">작성: {{ util.date(view.post.submitted, true, true) }}</span>

      <v-divider vertical v-if="view.post.modified > 0"></v-divider>
      <span class="ml-4 mr-4 text-caption" v-if="view.post.modified > 0"
        >수정: {{ util.date(view.post.modified, true, true) }}</span
      >
    </template>

    <template v-slot:append>
      <span class="mr-4 text-caption"
        ><v-icon size="small" class="mr-2">mdi-eye-outline</v-icon>
        {{ util.num(view.post.hit) }}</span
      >
      <v-divider vertical></v-divider>
      <span class="ml-4 text-caption"
        ><v-icon size="small" class="mr-2">mdi-comment-outline</v-icon> {{ view.post.reply }}</span
      >
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { useBoardViewStore } from "../../../store/board/view"
import { useUtilStore } from "../../../store/util"

const view = useBoardViewStore()
const util = useUtilStore()
</script>
