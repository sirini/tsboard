<template>
  <v-list-item class="pa-0 underline" v-if="view.files.length > 0">
    <v-list density="compact">
      <v-list-item
        prepend-icon="mdi-download"
        v-for="(file, index) in view.files"
        :key="index"
        @click="view.download(file.uid)"
        >{{ file.name }} ({{ util.num(file.size) }}B)</v-list-item
      >
    </v-list>
  </v-list-item>
</template>

<script setup lang="ts">
import { useBoardViewStore } from "../../../store/board/view"
import { useUtilStore } from "../../../store/util"

const view = useBoardViewStore()
const util = useUtilStore()
</script>
