<template>
  <v-list density="compact" v-if="view.files.length > 0">
    <v-list-item
      prepend-icon="mdi-download"
      v-for="(file, index) in view.files"
      :key="index"
      @click="view.download(file.uid)"
      rounded="pill"
      >{{ file.name }}

      <template v-slot:append>
        <v-chip variant="text" size="small">{{ util.num(file.size) }}B</v-chip></template
      >
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { useBoardViewStore } from "../../../store/board/view"
import { useUtilStore } from "../../../store/util"

const view = useBoardViewStore()
const util = useUtilStore()
</script>
