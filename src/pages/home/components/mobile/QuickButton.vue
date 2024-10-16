<template>
  <v-btn icon class="write" size="x-large" :color="home.color.header">
    <v-icon>mdi-pencil</v-icon>
    <v-menu activator="parent">
      <v-list bg-:color="home.color.header" class="mb-3">
        <v-list-item
          prepend-icon="mdi-message-text"
          @click="util.go('boardWrite', QUICK_BUTTONS.WRITE)"
          >{{ TEXT[home.lang].WRITE }}</v-list-item
        >
        <v-list-item
          prepend-icon="mdi-upload"
          @click="util.go('galleryWrite', QUICK_BUTTONS.UPLOAD)"
          >{{ TEXT[home.lang].UPLOAD }}</v-list-item
        >
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import { QUICK_BUTTONS } from "../../../../../tsboard.config"
import { TEXT } from "../../../../messages/pages/home/components/mobile/quick-button"
import { useHomeStore } from "../../../../store/home"
import { useUtilStore } from "../../../../store/util"

const util = useUtilStore()
const home = useHomeStore()
</script>

<style scoped>
.write {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
