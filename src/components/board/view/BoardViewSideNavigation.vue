<template>
  <v-card elevation="0" width="32" class="navigation" rounded="xl">
    <v-list
      density="compact"
      class="pa-0"
      :bg-color="view.config.type != BOARD.BLOG ? COLOR.HOME.BACKGROUND : COLOR.BLOG.BACKGROUND"
    >
      <v-list-item class="pa-0">
        <v-btn
          icon
          variant="text"
          size="x-small"
          @click="view.scrollToTop"
          :disabled="view.scrollY < 1"
        >
          <v-icon>mdi-chevron-up</v-icon>
          <v-tooltip activator="parent">{{ TEXT[home.lang].GO_TOP }}</v-tooltip>
        </v-btn>
      </v-list-item>
      <v-list-item class="pa-0">
        <v-btn
          icon
          variant="text"
          size="x-small"
          :disabled="view.nextPostUid < 1"
          @click="util.go(view.config.type, view.id, view.nextPostUid)"
        >
          <v-icon>mdi-chevron-left</v-icon>
          <v-tooltip activator="parent">{{ TEXT[home.lang].GO_NEXT }}</v-tooltip>
        </v-btn>
      </v-list-item>

      <v-list-item class="pa-0">
        <v-btn
          icon
          variant="text"
          size="x-small"
          :disabled="view.prevPostUid < 1"
          @click="util.go(view.config.type, view.id, view.prevPostUid)"
        >
          <v-icon>mdi-chevron-right</v-icon>
          <v-tooltip activator="parent">{{ TEXT[home.lang].GO_PREV }}</v-tooltip>
        </v-btn>
      </v-list-item>

      <v-list-item class="pa-0">
        <v-btn
          icon
          variant="text"
          size="x-small"
          @click="view.scrollToBottom"
          :disabled="view.scrollY + view.innerHeight + 5 >= view.scrollHeight"
        >
          <v-icon>mdi-chevron-down</v-icon>
          <v-tooltip activator="parent">{{ TEXT[home.lang].GO_BOTTOM }}</v-tooltip>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { COLOR } from "../../../../tsboard.config"
import { BOARD } from "../../../interface/board_interface"
import { TEXT } from "../../../messages/pages/board/view"
import { useBoardViewStore } from "../../../store/board/view"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"

const view = useBoardViewStore()
const home = useHomeStore()
const util = useUtilStore()
</script>

<style scoped>
.navigation {
  position: fixed;
  top: calc(50% - 80px);
  right: 0;
}
</style>
