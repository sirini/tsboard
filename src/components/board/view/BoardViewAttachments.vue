<template>
  <div v-if="view.files.length > 0">
    <v-list
      density="compact"
      :bg-color="view.config.type === BOARD.BLOG ? COLOR.BLOG.BACKGROUND : ''"
    >
      <v-list-item
        prepend-icon="mdi-download"
        v-for="(file, index) in view.files"
        :key="index"
        @click="view.download(file.uid)"
        >{{ file.name }} ({{ util.num(file.size) }}B)</v-list-item
      >
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { COLOR } from "../../../../tsboard.config"
import { BOARD } from "../../../interface/board_interface"
import { useBoardViewStore } from "../../../store/board/view"
import { useUtilStore } from "../../../store/util"

const view = useBoardViewStore()
const util = useUtilStore()
</script>
