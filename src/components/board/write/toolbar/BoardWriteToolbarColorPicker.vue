<template>
  <v-btn icon v-bind="props" size="small" :color="color"
    ><v-icon class="colorButton">mdi-square-rounded</v-icon>
    <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].COLOR }}</v-tooltip>
    <v-menu open-on-hover activator="parent" :close-on-content-click="false">
      <v-color-picker
        v-model="color"
        @vue:updated="editor?.chain().focus().setColor(color).run()"
      ></v-color-picker>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/vue-3"
import { ref } from "vue"
import { TEXT } from "../../../../messages/components/board/write/board-write-editor"
import { useHomeStore } from "../../../../store/home"

const props = defineProps<{ editor: Editor }>()
const home = useHomeStore()
const color = ref<string>("#000000")
</script>

<style lang="css" scoped>
.colorButton {
  border: 2px solid #ffffff;
  border-radius: 5px;
}
</style>
