<template>
  <div v-if="editor">
    <v-card elevation="0" v-show="writeEditor.isEditorMode">
      <v-toolbar
        density="compact"
        id="tsboardEditorToolbar"
        class="write-editor-menu"
        :color="type === BOARD_TYPE.BLOG ? 'grey-darken-4' : 'blue-grey-darken-2'"
      >
        <board-write-toolbar-bold-italic-strike-highlight
          :editor="editor"
        ></board-write-toolbar-bold-italic-strike-highlight>
        <board-write-toolbar-heading :editor="editor"></board-write-toolbar-heading>
        <board-write-toolbar-color-picker :editor="editor"></board-write-toolbar-color-picker>
        <board-write-toolbar-add-image></board-write-toolbar-add-image>
        <board-write-toolbar-add-table :editor="editor"></board-write-toolbar-add-table>
        <board-write-toolbar-code :editor="editor"></board-write-toolbar-code>
        <board-write-toolbar-list :editor="editor"></board-write-toolbar-list>
        <board-write-toolbar-quote-line :editor="editor"></board-write-toolbar-quote-line>
        <board-write-toolbar-undo-redo-reset :editor="editor"></board-write-toolbar-undo-redo-reset>
      </v-toolbar>

      <editor-content
        :editor="editor"
        :class="type === BOARD_TYPE.BLOG ? 'dark' : 'light'"
      ></editor-content>
    </v-card>

    <v-card elevation="0" v-show="writeEditor.isEditorMode == false">
      <v-textarea
        v-model="writeEditor.contentHTML"
        rows="8"
        auto-grow
        variant="outlined"
        :placeholder="TEXT[home.lang].HTML"
      ></v-textarea>
    </v-card>

    <v-card elevation="0" rounded="0">
      <v-btn
        prepend-icon="mdi-note-text-outline"
        :color="home.color.header"
        variant="text"
        size="small"
        @click="writeEditor.isEditorMode = true"
        >editor</v-btn
      >
      <v-btn
        prepend-icon="mdi-code-block-tags"
        :color="home.color.header"
        variant="text"
        size="small"
        @click="writeEditor.isEditorMode = false"
        >html</v-btn
      >
      <v-btn
        prepend-icon="mdi-check"
        :color="home.color.header"
        v-show="writeEditor.isEditorMode === false"
        class="ml-2"
        size="small"
        @click="writeEditor.applyHTMLContent(editor)"
        >apply</v-btn
      >
    </v-card>

    <board-write-editor-add-image-from-d-b-dialog
      @addImageURL="addImageURL"
      @removeImage="removeImage"
    ></board-write-editor-add-image-from-d-b-dialog>
    <board-write-editor-upload-image-dialog
      @addImageURL="addImageURL"
    ></board-write-editor-upload-image-dialog>
    <board-write-editor-add-image-dialog
      @addImageURL="addImageURL"
    ></board-write-editor-add-image-dialog>
    <board-write-editor-add-video-dialog
      @addVideoURL="addVideoURL"
    ></board-write-editor-add-video-dialog>
    <board-write-editor-add-table-dialog @addTable="addTable"></board-write-editor-add-table-dialog>
  </div>
</template>

<script setup lang="ts">
import Blockquote from "@tiptap/extension-blockquote"
import Bold from "@tiptap/extension-bold"
import BulletList from "@tiptap/extension-bullet-list"
import Code from "@tiptap/extension-code"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { Color } from "@tiptap/extension-color"
import Document from "@tiptap/extension-document"
import Dropcursor from "@tiptap/extension-dropcursor"
import Gapcursor from "@tiptap/extension-gapcursor"
import HardBreak from "@tiptap/extension-hard-break"
import Heading from "@tiptap/extension-heading"
import Highlight from "@tiptap/extension-highlight"
import History from "@tiptap/extension-history"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import Image from "@tiptap/extension-image"
import Italic from "@tiptap/extension-italic"
import Link from "@tiptap/extension-link"
import ListItem from "@tiptap/extension-list-item"
import OrderedList from "@tiptap/extension-ordered-list"
import Paragraph from "@tiptap/extension-paragraph"
import Strike from "@tiptap/extension-strike"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import Text from "@tiptap/extension-text"
import TextStyle from "@tiptap/extension-text-style"
import Typography from "@tiptap/extension-typography"
import Youtube from "@tiptap/extension-youtube"
import { EditorContent, useEditor } from "@tiptap/vue-3"
import cpp from "highlight.js/lib/languages/cpp"
import css from "highlight.js/lib/languages/css"
import java from "highlight.js/lib/languages/java"
import js from "highlight.js/lib/languages/javascript"
import kt from "highlight.js/lib/languages/kotlin"
import php from "highlight.js/lib/languages/php"
import py from "highlight.js/lib/languages/python"
import rs from "highlight.js/lib/languages/rust"
import ts from "highlight.js/lib/languages/typescript"
import { all, createLowlight } from "lowlight"
import { onBeforeUnmount, onMounted, watch } from "vue"
import { BOARD_TYPE } from "../../../../server/database/board/const"
import "../../../assets/board/editor.scss"
import { BoardType } from "../../../interface/board"
import { TableOption, VideoURL } from "../../../interface/editor"
import { TEXT } from "../../../messages/pages/board/write"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useEditorImageStore } from "../../../store/board/image"
import { useHomeStore } from "../../../store/home"
import BoardWriteEditorAddImageDialog from "./BoardWriteEditorAddImageDialog.vue"
import BoardWriteEditorAddImageFromDBDialog from "./BoardWriteEditorAddImageFromDBDialog.vue"
import BoardWriteEditorAddTableDialog from "./BoardWriteEditorAddTableDialog.vue"
import BoardWriteEditorAddVideoDialog from "./BoardWriteEditorAddVideoDialog.vue"
import BoardWriteEditorUploadImageDialog from "./BoardWriteEditorUploadImageDialog.vue"
import BoardWriteToolbarAddImage from "./toolbar/BoardWriteToolbarAddImage.vue"
import BoardWriteToolbarAddTable from "./toolbar/BoardWriteToolbarAddTable.vue"
import BoardWriteToolbarBoldItalicStrikeHighlight from "./toolbar/BoardWriteToolbarBoldItalicStrikeHighlight.vue"
import BoardWriteToolbarCode from "./toolbar/BoardWriteToolbarCode.vue"
import BoardWriteToolbarColorPicker from "./toolbar/BoardWriteToolbarColorPicker.vue"
import BoardWriteToolbarHeading from "./toolbar/BoardWriteToolbarHeading.vue"
import BoardWriteToolbarList from "./toolbar/BoardWriteToolbarList.vue"
import BoardWriteToolbarQuoteLine from "./toolbar/BoardWriteToolbarQuoteLine.vue"
import BoardWriteToolbarUndoRedoReset from "./toolbar/BoardWriteToolbarUndoRedoReset.vue"

const writeEditor = useBoardEditorStore()
const editorImage = useEditorImageStore()
const home = useHomeStore()
const props = defineProps<{
  modelValue: string
  type: BoardType
}>()
const emits = defineEmits(["update:modelValue", "updateRealHtml"])

// 스크롤 움직임에 따라 에디터 툴바 위치도 조정
let scrollTimer: any = null
let stickyScrollY = -1
function changeToolbarPosition(): void {
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    const toolbar = document.querySelector<HTMLDivElement>("#tsboardEditorToolbar")
    if (!toolbar) return

    toolbar.style.width = `${Math.min(window.innerWidth - 32, writeEditor.config.width)}px`
    const toolbarRect = toolbar.getBoundingClientRect()
    if (toolbarRect.top < 74 && stickyScrollY < 0) {
      toolbar.classList.add("sticky")
      stickyScrollY = window.scrollY
    }
    if (stickyScrollY > window.scrollY) {
      toolbar.classList.remove("sticky")
      stickyScrollY = -1
    }
  }, 100)
}

onMounted(async () => {
  await writeEditor.loadBoardConfig()
  window.addEventListener("scroll", changeToolbarPosition)
  editorImage.boardUid = writeEditor.config.uid
})

watch(
  () => writeEditor.id,
  () => {
    writeEditor.loadBoardConfig()
    editorImage.boardUid = writeEditor.config.uid
  },
)

const lowlight = createLowlight(all)
lowlight.register("css", css)
lowlight.register("js", js)
lowlight.register("ts", ts)
lowlight.register("py", py)
lowlight.register("kt", kt)
lowlight.register("java", java)
lowlight.register("cpp", cpp)
lowlight.register("php", php)
lowlight.register("rs", rs)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    Blockquote,
    BulletList,
    Document,
    HardBreak,
    Heading,
    HorizontalRule,
    ListItem,
    OrderedList,
    Paragraph,
    Text,
    Bold,
    Code,
    Italic,
    Strike,
    Dropcursor,
    Gapcursor,
    History,
    Highlight,
    Image.configure({ inline: true }),
    Youtube,
    Color,
    TextStyle,
    Table.configure({
      resizable: true,
    }),
    TableCell,
    TableHeader,
    TableRow,
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: "typescript",
    }),
    Link,
    Typography,
  ],
  onUpdate: () => {
    let html = editor.value?.getHTML() || ""
    const e = document.querySelector(".tiptap") as HTMLDivElement
    emits("update:modelValue", html)
    emits("updateRealHtml", e.innerHTML)
    writeEditor.autoSave()
  },
})

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value?.getHTML() === value) {
      return
    }
    editor.value?.commands.setContent(value, false)
  },
)

// 기존 or 외부 이미지 추가하기
function addImageURL(src: string): void {
  editor.value?.commands.focus("end")
  editor.value?.commands.setImage({ src })
  editor.value?.commands.enter()
  editor.value?.commands.focus("end")
}

// URI 특수문자만 인코딩하기
function encodeSpecialChars(target: string): string {
  let result = target
  const filters = [
    { from: "&", to: "&amp;" },
    { from: "<", to: "&lt;" },
    { from: ">", to: "&gt;" },
  ]
  for (const filter of filters) {
    result = result.replaceAll(filter.from, filter.to)
  }
  return result
}

// 기존 이미지 삭제하기
function removeImage(src: string): void {
  const originalContent = editor.value?.getHTML() || ""
  const encodedSrc = encodeSpecialChars(src)
  const newContent = originalContent.replaceAll(encodedSrc, "/image-not-found.svg")

  editor.value?.commands.clearContent()
  editor.value?.commands.insertContent(newContent || "")
}

// YouTube 동영상 추가하기
function addVideoURL(link: VideoURL): void {
  const { src, width, height } = link
  editor.value?.commands.focus("end")
  editor.value?.commands.setYoutubeVideo({
    src,
    width,
    height,
  })
  editor.value?.commands.enter()
  editor.value?.commands.focus("end")
}

// 표 추가하기
function addTable(option: TableOption): void {
  const { rows, cols, withHeaderRow } = option
  editor.value?.commands.focus("end")
  editor.value?.chain().focus().insertTable({ rows, cols, withHeaderRow }).run()
  editor.value?.commands.enter()
  editor.value?.commands.focus("end")
}

// 에디터 메모리 정리하기
onBeforeUnmount(() => {
  editor.value?.destroy()
  window.removeEventListener("scroll", changeToolbarPosition)
})
</script>

<style scoped>
.dark {
  background-color: #191919;
}
.light {
  background-color: #f9f9f9;
}
.write-editor-menu {
  position: sticky;
  top: 0;
  z-index: 10;
  transition: all 0.5s ease;
}
.sticky {
  position: fixed;
  top: 64px;
  z-index: 100;
  opacity: 0.9;
  margin-left: -12px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
