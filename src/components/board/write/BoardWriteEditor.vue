<template>
  <div v-if="editor">
    <v-toolbar
      density="compact"
      id="tsboardEditorToolbar"
      class="write-editor-menu"
      :color="type === BOARD_TYPE.BLOG ? 'grey-darken-4' : 'blue-grey-darken-2'"
    >
      <v-btn icon @click="editor?.chain().focus().toggleBold().run()"
        ><v-icon>mdi-format-bold</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].BOLD }}</v-tooltip>
      </v-btn>
      <v-btn icon @click="editor?.chain().focus().toggleItalic().run()"
        ><v-icon>mdi-format-italic</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].ITALIC }}</v-tooltip>
      </v-btn>
      <v-btn icon @click="editor?.chain().focus().toggleStrike().run()"
        ><v-icon>mdi-format-strikethrough-variant</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].STRIKE }}</v-tooltip>
      </v-btn>
      <v-btn icon
        ><v-icon>mdi-format-header-1</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].HEADING }}</v-tooltip>
        <v-menu open-on-hover activator="parent">
          <v-list>
            <v-list-item
              @click="editor?.chain().focus().toggleHeading({ level }).run()"
              v-for="(level, index) in headingLevels"
              :key="index"
            >
              <template v-slot:prepend>
                <v-icon>mdi-format-header-{{ level }}</v-icon>
              </template>
              <v-list-item-title>H{{ level }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <v-btn icon v-bind="props"
        ><v-icon>mdi-palette</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].COLOR }}</v-tooltip>
        <v-menu open-on-hover activator="parent">
          <v-list density="compact">
            <v-list-item @click="editor?.chain().focus().setColor('#F44336').run()">
              <v-list-item-title><span style="color: #f44336">◼︎ Red</span></v-list-item-title>
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#E91E63').run()">
              <v-list-item-title><span style="color: #e91e63">◼︎ Pink</span></v-list-item-title>
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#9C27B0').run()">
              <v-list-item-title><span style="color: #9c27b0">◼︎ Purple</span></v-list-item-title>
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#673AB7').run()">
              <v-list-item-title
                ><span style="color: #673ab7">◼︎ Deep purple</span></v-list-item-title
              >
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#3F51B5').run()">
              <v-list-item-title><span style="color: #3f51b5">◼︎ Indigo</span></v-list-item-title>
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#2196F3').run()">
              <v-list-item-title><span style="color: #2196f3">◼︎ Blue</span></v-list-item-title>
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#03A9F4').run()">
              <v-list-item-title
                ><span style="color: #03a9f4">◼︎ Light blue</span></v-list-item-title
              >
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#00BCD4').run()">
              <v-list-item-title><span style="color: #00bcd4">◼︎ Cyan</span></v-list-item-title>
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#009688').run()">
              <v-list-item-title><span style="color: #009688">◼︎ Teal</span></v-list-item-title>
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#4CAF50').run()">
              <v-list-item-title><span style="color: #4caf50">◼︎ Green</span></v-list-item-title>
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#8BC34A').run()">
              <v-list-item-title
                ><span style="color: #8bc34a">◼︎ Light green</span></v-list-item-title
              >
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#CDDC39').run()">
              <v-list-item-title><span style="color: #cddc39">◼︎ Lime</span></v-list-item-title>
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#FFEB3B').run()">
              <v-list-item-title><span style="color: #ffeb3b">◼︎ Yellow</span></v-list-item-title>
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#FFC107').run()">
              <v-list-item-title><span style="color: #ffc107">◼︎ Amber</span></v-list-item-title>
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#FF9800').run()">
              <v-list-item-title><span style="color: #ff9800">◼︎ Orange</span></v-list-item-title>
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#FF5722').run()">
              <v-list-item-title
                ><span style="color: #ff5722">◼︎ Deep orange</span></v-list-item-title
              >
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#795548').run()">
              <v-list-item-title><span style="color: #795548">◼︎ Brown</span></v-list-item-title>
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#607D8B').run()">
              <v-list-item-title
                ><span style="color: #607d8b">◼︎ Blue grey</span></v-list-item-title
              >
            </v-list-item>
            <v-list-item @click="editor?.chain().focus().setColor('#9E9E9E').run()">
              <v-list-item-title><span style="color: #9e9e9e">◼︎ Grey</span></v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="editor?.chain().focus().unsetColor().run()">
              <v-list-item-title
                ><span style="color: #000000"
                  >◼︎ {{ TEXT[home.lang].DEFAULT }} (Black)</span
                ></v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-image</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].ADD_IMAGE }}</v-tooltip>
        <v-menu open-on-hover activator="parent">
          <v-list density="compact">
            <v-list-item
              prepend-icon="mdi-image-plus"
              @click="editorImage.uploadImageDialog = true"
            >
              {{ TEXT[home.lang].UPLOAD_IMAGE }}
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-image-search-outline"
              @click="editorImage.addImageFromDBDialog = true"
            >
              {{ TEXT[home.lang].ADD_EXIST_IMAGE }}
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-link-variant-plus"
              @click="writeEditor.addImageURLDialog = true"
            >
              {{ TEXT[home.lang].ADD_EXTERNAL_IMAGE }}
            </v-list-item>
            <v-list-item prepend-icon="mdi-youtube" @click="writeEditor.addVideoURLDialog = true">
              {{ TEXT[home.lang].ADD_YOUTUBE }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-table</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].TABLE }}</v-tooltip>
        <v-menu open-on-hover activator="parent">
          <v-list density="compact">
            <v-list-item prepend-icon="mdi-table-plus" @click="writeEditor.addTableDialog = true">{{
              TEXT[home.lang].ADD_TABLE
            }}</v-list-item>
            <v-list-item
              prepend-icon="mdi-table-column-plus-before"
              @click="editor?.chain().focus().addColumnBefore().run()"
              >{{ TEXT[home.lang].ADD_BEFORE_COLUMN }}</v-list-item
            >
            <v-list-item
              prepend-icon="mdi-table-column-plus-after"
              @click="editor?.chain().focus().addColumnAfter().run()"
              >{{ TEXT[home.lang].ADD_AFTER_COLUMN }}</v-list-item
            >
            <v-list-item
              prepend-icon="mdi-table-column-remove"
              @click="editor?.chain().focus().deleteColumn().run()"
            >
              {{ TEXT[home.lang].REMOVE_COLUMN }}
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-table-row-plus-before"
              @click="editor?.chain().focus().addRowBefore().run()"
            >
              {{ TEXT[home.lang].ADD_BEFORE_ROW }}
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-table-row-plus-after"
              @click="editor?.chain().focus().addRowAfter().run()"
            >
              {{ TEXT[home.lang].ADD_AFTER_ROW }}
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-table-row-remove"
              @click="editor?.chain().focus().deleteRow().run()"
            >
              {{ TEXT[home.lang].REMOVE_ROW }}
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-table-remove"
              @click="editor?.chain().focus().deleteTable().run()"
            >
              {{ TEXT[home.lang].REMOVE_TABLE }}
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-table-merge-cells"
              @click="editor?.chain().focus().mergeCells().run()"
            >
              {{ TEXT[home.lang].MERGE_CELL }}
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-table-split-cell"
              @click="editor?.chain().focus().splitCell().run()"
            >
              {{ TEXT[home.lang].SPLIT_CELL }}
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-table-edit"
              @click="editor?.chain().focus().toggleHeaderCell().run()"
            >
              {{ TEXT[home.lang].TOGGLE_HEADER_CELL }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>

      <v-btn icon @click="editor?.chain().focus().toggleHighlight().run()"
        ><v-icon>mdi-format-color-highlight</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].HIGHLIGHT }}</v-tooltip>
      </v-btn>
      <v-btn icon @click="editor?.chain().focus().toggleCode().run()"
        ><v-icon>mdi-code-braces</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].CODE_LINE }}</v-tooltip>
      </v-btn>
      <v-btn icon @click="editor?.chain().focus().toggleCodeBlock().run()"
        ><v-icon>mdi-code-braces-box</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].CODE_BLOCK }}</v-tooltip>
      </v-btn>

      <v-btn icon @click="editor?.chain().focus().toggleBulletList().run()"
        ><v-icon>mdi-format-list-bulleted-type</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].UNORDER_LIST }}</v-tooltip>
      </v-btn>
      <v-btn icon @click="editor?.chain().focus().toggleOrderedList().run()"
        ><v-icon>mdi-format-list-numbered</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].ORDER_LIST }}</v-tooltip>
      </v-btn>
      <v-btn icon @click="editor?.chain().focus().toggleBlockquote().run()"
        ><v-icon>mdi-format-quote-open</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].QUOTE }}</v-tooltip>
      </v-btn>
      <v-btn icon @click="editor?.chain().focus().setHorizontalRule().run()"
        ><v-icon>mdi-minus</v-icon>
        <v-tooltip activator="parent" location="top">{{
          TEXT[home.lang].HORIZONTAL_LINE
        }}</v-tooltip>
      </v-btn>

      <v-btn icon @click="editor?.chain().focus().undo().run()"
        ><v-icon>mdi-arrow-u-left-top</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].UNDO }}</v-tooltip>
      </v-btn>
      <v-btn icon @click="editor?.chain().focus().redo().run()"
        ><v-icon>mdi-arrow-u-right-top</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].REDO }}</v-tooltip>
      </v-btn>
      <v-btn icon @click="editor?.chain().focus().unsetAllMarks().run()"
        ><v-icon>mdi-restore</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].UNSET }}</v-tooltip>
      </v-btn>
    </v-toolbar>

    <editor-content
      :editor="editor"
      :class="type === BOARD_TYPE.BLOG ? 'dark' : 'light'"
    ></editor-content>

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
import { watch, onMounted, onBeforeUnmount, ref } from "vue"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useEditorImageStore } from "../../../store/board/image"
import { useHomeStore } from "../../../store/home"
import { useEditor, EditorContent } from "@tiptap/vue-3"
import Blockquote from "@tiptap/extension-blockquote"
import BulletList from "@tiptap/extension-bullet-list"
import Document from "@tiptap/extension-document"
import HardBreak from "@tiptap/extension-hard-break"
import Heading from "@tiptap/extension-heading"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import ListItem from "@tiptap/extension-list-item"
import OrderedList from "@tiptap/extension-ordered-list"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import Bold from "@tiptap/extension-bold"
import Code from "@tiptap/extension-code"
import Italic from "@tiptap/extension-italic"
import Strike from "@tiptap/extension-strike"
import Dropcursor from "@tiptap/extension-dropcursor"
import Gapcursor from "@tiptap/extension-gapcursor"
import History from "@tiptap/extension-history"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import Youtube from "@tiptap/extension-youtube"
import { Color } from "@tiptap/extension-color"
import TextStyle from "@tiptap/extension-text-style"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import Link from "@tiptap/extension-link"
import Typography from "@tiptap/extension-typography"
import css from "highlight.js/lib/languages/css"
import js from "highlight.js/lib/languages/javascript"
import ts from "highlight.js/lib/languages/typescript"
import py from "highlight.js/lib/languages/python"
import kt from "highlight.js/lib/languages/kotlin"
import java from "highlight.js/lib/languages/java"
import cpp from "highlight.js/lib/languages/cpp"
import php from "highlight.js/lib/languages/php"
import rs from "highlight.js/lib/languages/rust"
import { all, createLowlight } from "lowlight"
import { VideoURL, TableOption } from "../../../interface/editor"
import BoardWriteEditorUploadImageDialog from "./BoardWriteEditorUploadImageDialog.vue"
import BoardWriteEditorAddImageFromDBDialog from "./BoardWriteEditorAddImageFromDBDialog.vue"
import BoardWriteEditorAddImageDialog from "./BoardWriteEditorAddImageDialog.vue"
import BoardWriteEditorAddVideoDialog from "./BoardWriteEditorAddVideoDialog.vue"
import BoardWriteEditorAddTableDialog from "./BoardWriteEditorAddTableDialog.vue"
import "../../../assets/board/editor.scss"
import { TEXT } from "../../../messages/components/board/write/board-write-editor"
import { BOARD_TYPE } from "../../../../server/database/board/const"
import { BoardType } from "../../../interface/board"

const writeEditor = useBoardEditorStore()
const editorImage = useEditorImageStore()
const home = useHomeStore()
const props = defineProps<{
  modelValue: string
  type: BoardType
}>()
const emits = defineEmits(["update:modelValue", "updateRealHtml"])
const stickyPoint = ref<number>(9999)

// 스크롤 움직임에 따라 에디터 툴바 위치도 조정
let scrollTimer: any = null
function changeToolbarPosition(): void {
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    const toolbar = document.querySelector("#tsboardEditorToolbar") as HTMLDivElement
    if (!toolbar) return

    if (window.scrollY > stickyPoint.value) {
      toolbar.classList.add("sticky")
      toolbar.style.width = `${writeEditor.config.width}px`
    } else {
      toolbar.classList.remove("sticky")
      toolbar.style.width = ""
      stickyPoint.value = toolbar.offsetTop
    }
  }, 200)
}

onMounted(async () => {
  await writeEditor.loadBoardConfig()
  window.addEventListener("scroll", changeToolbarPosition)
})

watch(
  () => writeEditor.id,
  () => writeEditor.loadBoardConfig(),
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
    Image,
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
  background-color: #141414;
}
.light {
  background-color: #fafafa;
}
.write-editor-menu {
  position: sticky;
  top: 0;
  z-index: 10;
  transition: all 0.3s ease;
}

.sticky {
  position: fixed;
  top: 64px;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  opacity: 0.8;
}
</style>
