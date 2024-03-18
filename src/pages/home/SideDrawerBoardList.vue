<template>
  <v-card
    class="mt-3"
    elevation="0"
    rounded="0"
    v-for="(group, index) in home.sidebarLinks"
    :key="index"
  >
    <v-list>
      <v-list-subheader>{{ group.group }}</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item
        v-for="(board, idx) in group.boards"
        :key="idx"
        @click="util.go('boardList', board.id)"
        append-icon="mdi-chevron-right"
        >{{ board.name }}
        <v-tooltip activator="parent">{{ board.info }}</v-tooltip>
      </v-list-item>
      <v-divider></v-divider>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"

const home = useHomeStore()
const util = useUtilStore()

onMounted(() => home.loadSidebarLinks())
</script>
