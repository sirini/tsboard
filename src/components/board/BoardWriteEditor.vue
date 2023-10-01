<template>
  <v-toolbar density="compact" class="write_editor_menu">
    <v-btn icon @click="editor?.chain().focus().toggleBold().run()"
      ><v-icon>mdi-format-bold</v-icon>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().toggleItalic().run()"
      ><v-icon>mdi-format-italic</v-icon>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().toggleStrike().run()"
      ><v-icon>mdi-format-strikethrough-variant</v-icon>
    </v-btn>
    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props"><v-icon>mdi-palette</v-icon></v-btn>
      </template>
      <v-list>
        <v-list-item @click="editor?.chain().focus().setColor('#958DF1').run()">
          <v-list-item-title><span style="color: #958df1">◼︎ 보라색</span></v-list-item-title>
        </v-list-item>
        <v-list-item @click="editor?.chain().focus().setColor('#F98181').run()">
          <v-list-item-title><span style="color: #f98181">◼︎ 붉은색</span></v-list-item-title>
        </v-list-item>
        <v-list-item @click="editor?.chain().focus().setColor('#FBBC88').run()">
          <v-list-item-title><span style="color: #fbbc88">◼︎ 주황색</span></v-list-item-title>
        </v-list-item>
        <v-list-item @click="editor?.chain().focus().setColor('#FAF594').run()">
          <v-list-item-title><span style="color: #faf594">◼︎ 노란색</span></v-list-item-title>
        </v-list-item>
        <v-list-item @click="editor?.chain().focus().setColor('#70CFF8').run()">
          <v-list-item-title><span style="color: #70cff8">◼︎ 파란색</span></v-list-item-title>
        </v-list-item>
        <v-list-item @click="editor?.chain().focus().setColor('#94FADB').run()">
          <v-list-item-title><span style="color: #94fadb">◼︎ 틸 색</span></v-list-item-title>
        </v-list-item>
        <v-list-item @click="editor?.chain().focus().setColor('#B9F18D').run()">
          <v-list-item-title><span style="color: #b9f18d">◼︎ 초록색</span></v-list-item-title>
        </v-list-item>
        <v-list-item @click="editor?.chain().focus().unsetColor().run()">
          <v-list-item-title><span style="color: #000000">◻︎ 색상 지우기</span></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn icon @click="board.uploadImageDialog = true"><v-icon>mdi-image-plus</v-icon> </v-btn>
    <v-divider vertical></v-divider>
    <v-btn icon @click="editor?.chain().focus().toggleCode().run()"
      ><v-icon>mdi-code-braces</v-icon>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().toggleCodeBlock().run()"
      ><v-icon>mdi-code-braces-box</v-icon>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().toggleHighlight().run()"
      ><v-icon>mdi-format-color-highlight</v-icon>
    </v-btn>
    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props"><v-icon>mdi-format-header-1</v-icon></v-btn>
      </template>
      <v-list>
        <v-list-item
          @click="editor?.chain().focus().toggleHeading({ level }).run()"
          v-for="(level, index) in headingLevels"
          :key="index"
        >
          <template v-slot:prepend>
            <v-icon>mdi-format-header-{{ level }}</v-icon>
          </template>
          <v-list-item-title>글 제목 {{ level }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-divider vertical></v-divider>
    <v-btn icon @click="editor?.chain().focus().toggleBulletList().run()"
      ><v-icon>mdi-format-list-bulleted-type</v-icon>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().toggleOrderedList().run()"
      ><v-icon>mdi-format-list-numbered</v-icon>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().toggleBlockquote().run()"
      ><v-icon>mdi-format-quote-open</v-icon>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().setHorizontalRule().run()"
      ><v-icon>mdi-minus</v-icon>
    </v-btn>
    <v-divider vertical></v-divider>
    <v-btn icon @click="editor?.chain().focus().undo().run()"
      ><v-icon>mdi-arrow-u-left-top</v-icon>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().redo().run()"
      ><v-icon>mdi-arrow-u-right-top</v-icon>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().unsetAllMarks().run()"
      ><v-icon>mdi-restore</v-icon>
    </v-btn>
  </v-toolbar>
  <editor-content :editor="editor"></editor-content>
  <board-write-editor-upload-image-dialog></board-write-editor-upload-image-dialog>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from "vue"
import { useEditor, EditorContent } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import { Color } from "@tiptap/extension-color"
import TextStyle from "@tiptap/extension-text-style"
import { useBoardStore } from "../../store/board"
import BoardWriteEditorUploadImageDialog from "./BoardWriteEditorUploadImageDialog.vue"
import "../../assets/board/editor.scss"

const board = useBoardStore()
const props = defineProps<{
  modelValue: string
}>()
const emits = defineEmits(["update:modelValue"])
const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit, Highlight, Image, Color, TextStyle],
  onUpdate: () => {
    emits("update:modelValue", editor.value?.getHTML())
  },
})
declare type Level = 1 | 2 | 3 | 4 | 5 | 6
const headingLevels: Level[] = [1, 2, 3, 4, 5, 6]

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value?.getHTML() === value) {
      return
    }
    editor.value?.commands.setContent(value, false)
  },
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.write_editor_menu {
  border-left: 1px #dddddd solid;
  border-right: 1px #dddddd solid;
  border-top: 1px #dddddd solid;
}
</style>
