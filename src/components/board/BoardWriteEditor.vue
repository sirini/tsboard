<template>
  <v-toolbar density="compact" class="write_editor_menu">
    <v-btn icon @click="editor.chain().focus().toggleBold().run()"
      ><v-icon>mdi-format-bold</v-icon>
    </v-btn>
    <v-btn icon @click="editor.chain().focus().toggleItalic().run()"
      ><v-icon>mdi-format-italic</v-icon>
    </v-btn>
    <v-btn icon @click="editor.chain().focus().toggleStrike().run()"
      ><v-icon>mdi-format-strikethrough-variant</v-icon>
    </v-btn>
    <v-btn icon @click="board.uploadImages(editor)"><v-icon>mdi-image-plus</v-icon> </v-btn>
    <v-divider vertical></v-divider>
    <v-btn icon @click="editor.chain().focus().toggleCode().run()"
      ><v-icon>mdi-code-braces</v-icon>
    </v-btn>
    <v-btn icon @click="editor.chain().focus().toggleCodeBlock().run()"
      ><v-icon>mdi-code-braces-box</v-icon>
    </v-btn>
    <v-btn icon @click="editor.chain().focus().toggleHighlight().run()"
      ><v-icon>mdi-format-color-highlight</v-icon>
    </v-btn>
    <v-divider vertical></v-divider>
    <v-btn icon @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      ><v-icon>mdi-format-header-1</v-icon>
    </v-btn>
    <v-btn icon @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      ><v-icon>mdi-format-header-2</v-icon>
    </v-btn>
    <v-btn icon @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      ><v-icon>mdi-format-header-3</v-icon>
    </v-btn>
    <v-divider vertical></v-divider>
    <v-btn icon @click="editor.chain().focus().toggleBulletList().run()"
      ><v-icon>mdi-format-list-bulleted-type</v-icon>
    </v-btn>
    <v-btn icon @click="editor.chain().focus().toggleOrderedList().run()"
      ><v-icon>mdi-format-list-numbered</v-icon>
    </v-btn>
    <v-divider vertical></v-divider>
    <v-btn icon @click="editor.chain().focus().toggleBlockquote().run()"
      ><v-icon>mdi-format-quote-open</v-icon>
    </v-btn>
    <v-btn icon @click="editor.chain().focus().setHorizontalRule().run()"
      ><v-icon>mdi-minus</v-icon>
    </v-btn>
    <v-divider vertical></v-divider>
    <v-btn icon @click="editor.chain().focus().undo().run()"
      ><v-icon>mdi-arrow-u-left-top</v-icon>
    </v-btn>
    <v-btn icon @click="editor.chain().focus().redo().run()"
      ><v-icon>mdi-arrow-u-right-top</v-icon>
    </v-btn>
    <v-btn icon @click="editor.chain().focus().unsetAllMarks().run()"
      ><v-icon>mdi-restore</v-icon>
    </v-btn>
  </v-toolbar>
  <editor-content :editor="editor"></editor-content>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from "vue"
import { useEditor, EditorContent } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import { useBoardStore } from "../../store/board"
import "../../assets/board/editor.css"

const board = useBoardStore()
const props = defineProps<{
  modelValue: string
}>()
const emits = defineEmits(["update:modelValue"])

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit, Highlight, Image],
  onUpdate: () => {
    emits("update:modelValue", editor.value.getHTML())
  },
})

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value.getHTML() === value) {
      return
    }
    editor.value.commands.setContent(value, false)
  },
)

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<style scoped>
.write_editor_menu {
  border-left: 1px #dddddd solid;
  border-right: 1px #dddddd solid;
  border-top: 1px #dddddd solid;
}
</style>
