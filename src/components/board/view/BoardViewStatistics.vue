<template>
  <v-list>
    <v-list-item class="underline">
      <template v-slot:prepend>
        <span class="mr-2 text-caption" v-if="view.config.useCategory"
          ><v-icon size="small" class="mr-2">mdi-filter-outline</v-icon>
          {{ view.post.category.name }}</span
        >
        <span class="mr-2 text-caption" v-if="home.isMobile === false"
          >{{ TEXT[home.lang].SUBMITTED }}: {{ util.date(view.post.submitted, true, true) }}</span
        >

        <span class="ml-2 mr-2 text-caption" v-if="view.post.modified > 0"
          >{{ TEXT[home.lang].MODIFIED }}: {{ util.date(view.post.modified, true, true) }}</span
        >
      </template>

      <template v-slot:append>
        <span class="mr-3 text-caption"
          ><v-icon size="small" class="mr-2">mdi-eye-outline</v-icon>
          {{ util.num(view.post.hit) }}</span
        >
        <span class="ml-3 text-caption"
          ><v-icon size="small" class="mr-2">mdi-comment-outline</v-icon>
          {{ view.post.comment }}</span
        >
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { TEXT } from "../../../messages/pages/board/view"
import { useBoardViewStore } from "../../../store/board/view"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"

const view = useBoardViewStore()
const util = useUtilStore()
const home = useHomeStore()
</script>

<style scoped>
.underline {
  border-bottom: #eceff1 1px solid;
}
</style>
