<template>
  <v-dialog v-model="editor.addImageURLDialog" persistent>
    <v-card :max-width="home.dialogWidth" class="mx-auto" rounded="lg" :color="home.color.header">
      <v-card-title>{{ TEXT[home.lang].TITLE_EXTERNAL_IMAGE }}</v-card-title>
      <v-divider></v-divider>

      <alert-bar></alert-bar>
      <v-card-text>
        <v-text-field
          v-model="link"
          variant="solo"
          prepend-inner-icon="mdi-web-plus"
          :rules="rule"
          @keyup.enter="add"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="editor.addImageURLDialog = false">{{
          TEXT[home.lang].CLOSE
        }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="add" append-icon="mdi-chevron-right">{{
          TEXT[home.lang].ADD_TO_CONTENT
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useUtilStore } from "../../../store/util"
import { useHomeStore } from "../../../store/home"
import AlertBar from "../../util/AlertBar.vue"
import { TEXT } from "../../../messages/components/board/write/board-write-editor-others"

const util = useUtilStore()
const home = useHomeStore()
const editor = useBoardEditorStore()
const emits = defineEmits<{
  addImageURL: [url: string]
}>()
const link = ref<string>("http://")
const rule = [
  (value: string) => {
    return (
      !value ||
      value.length < 10 ||
      util.filters.url.test(value) === true ||
      TEXT[home.lang].INVALID_IMAGE_URL
    )
  },
]

// 외부 이미지 추가 반영하기
function add(): void {
  if (util.filters.url.test(link.value) === false) {
    util.error(TEXT[home.lang].INVALID_IMAGE_URL)
    return
  }
  emits("addImageURL", link.value)
}
</script>

<style scoped>
/** 다이얼로그 배경 조정 */
.v-overlay--active {
  animation: tsboardCustomOverlay 0.5s ease-in forwards;
}
@keyframes tsboardCustomOverlay {
  from {
    backdrop-filter: blur(0px);
    background: rgba(0, 0, 0, 0);
  }
  to {
    backdrop-filter: blur(2px);
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
