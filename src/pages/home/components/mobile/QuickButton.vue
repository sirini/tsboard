<template>
  <v-btn icon class="write" size="x-large" color="blue-grey" elevation="0">
    <v-icon>mdi-pencil</v-icon>
    <v-menu activator="parent">
      <v-list bg-color="blue-grey" class="mb-6">
        <v-list-item prepend-icon="mdi-message-text" @click="util.go('boardWrite', writeTarget)">{{
          TEXT[home.lang].WRITE
        }}</v-list-item>
        <v-list-item prepend-icon="mdi-upload" @click="util.go('galleryWrite', uploadTarget)">{{
          TEXT[home.lang].UPLOAD
        }}</v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useUtilStore } from "../../../../store/util"
import { useHomeStore } from "../../../../store/home"
import { TEXT } from "../../../../messages/pages/home/components/mobile/quick-button"

const util = useUtilStore()
const home = useHomeStore()

// 아래 게시판 ID를 사이트에 맞게 수정
const writeTarget = ref<string>("free")
const uploadTarget = ref<string>("photo")
</script>

<style scoped>
.write {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
