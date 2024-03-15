<template>
  <v-toolbar density="compact" class="write_editor_menu" :color="home.color.header">
    <v-btn icon @click="editor?.chain().focus().toggleBold().run()"
      ><v-icon>mdi-format-bold</v-icon>
      <v-tooltip activator="parent" location="top">글자 굵게</v-tooltip>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().toggleItalic().run()"
      ><v-icon>mdi-format-italic</v-icon>
      <v-tooltip activator="parent" location="top">글자 기울이기</v-tooltip>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().toggleStrike().run()"
      ><v-icon>mdi-format-strikethrough-variant</v-icon>
      <v-tooltip activator="parent" location="top">취소선 그리기</v-tooltip>
    </v-btn>
    <v-btn icon
      ><v-icon>mdi-format-header-1</v-icon>
      <v-tooltip activator="parent" location="top">글 제목 레벨 지정</v-tooltip>
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
            <v-list-item-title>글 제목 {{ level }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
    <v-btn icon v-bind="props"
      ><v-icon>mdi-palette</v-icon>
      <v-tooltip activator="parent" location="top">글자 색상 지정</v-tooltip>
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
            <v-list-item-title><span style="color: #607d8b">◼︎ Blue grey</span></v-list-item-title>
          </v-list-item>
          <v-list-item @click="editor?.chain().focus().setColor('#9E9E9E').run()">
            <v-list-item-title><span style="color: #9e9e9e">◼︎ Grey</span></v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="editor?.chain().focus().unsetColor().run()">
            <v-list-item-title
              ><span style="color: #000000">◼︎ 기본 (Black)</span></v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-image</v-icon>
      <v-tooltip activator="parent" location="top"
        >이미지 추가 (직접 업로드 혹은 외부 링크)</v-tooltip
      >
      <v-menu open-on-hover activator="parent">
        <v-list density="compact">
          <v-list-item prepend-icon="mdi-image-plus" @click="editorImage.uploadImageDialog = true">
            이미지 파일 직접 업로드
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-image-search-outline"
            @click="editorImage.addImageFromDBDialog = true"
          >
            기존 이미지 추가/관리
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-link-variant-plus"
            @click="writeEditor.addImageURLDialog = true"
          >
            외부 이미지 URL 추가
          </v-list-item>
          <v-list-item prepend-icon="mdi-youtube" @click="writeEditor.addVideoURLDialog = true">
            YouTube URL 추가
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-table</v-icon>
      <v-tooltip activator="parent" location="top">표 (Table) 작업</v-tooltip>
      <v-menu open-on-hover activator="parent">
        <v-list density="compact">
          <v-list-item prepend-icon="mdi-table-plus" @click="writeEditor.addTableDialog = true"
            >표 추가하기</v-list-item
          >
          <v-list-item
            prepend-icon="mdi-table-column-plus-before"
            @click="editor?.chain().focus().addColumnBefore().run()"
            >앞에 열(column) 추가하기</v-list-item
          >
          <v-list-item
            prepend-icon="mdi-table-column-plus-after"
            @click="editor?.chain().focus().addColumnAfter().run()"
            >뒤에 열(column) 추가하기</v-list-item
          >
          <v-list-item
            prepend-icon="mdi-table-column-remove"
            @click="editor?.chain().focus().deleteColumn().run()"
          >
            열(column) 삭제하기
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-table-row-plus-before"
            @click="editor?.chain().focus().addRowBefore().run()"
          >
            위에 행(row) 추가하기
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-table-row-plus-after"
            @click="editor?.chain().focus().addRowAfter().run()"
          >
            아래에 행(row) 추가하기
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-table-row-remove"
            @click="editor?.chain().focus().deleteRow().run()"
          >
            행(row) 삭제하기
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-table-remove"
            @click="editor?.chain().focus().deleteTable().run()"
          >
            표 삭제하기
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-table-merge-cells"
            @click="editor?.chain().focus().mergeCells().run()"
          >
            셀 병합하기
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-table-split-cell"
            @click="editor?.chain().focus().splitCell().run()"
          >
            셀 분리하기
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-table-edit"
            @click="editor?.chain().focus().toggleHeaderCell().run()"
          >
            헤더로 변환 혹은 취소
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>

    <v-btn icon @click="editor?.chain().focus().toggleHighlight().run()"
      ><v-icon>mdi-format-color-highlight</v-icon>
      <v-tooltip activator="parent" location="top">글자 강조(하이라이트)</v-tooltip>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().toggleCode().run()"
      ><v-icon>mdi-code-braces</v-icon>
      <v-tooltip activator="parent" location="top">코드 표현하기</v-tooltip>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().toggleCodeBlock().run()"
      ><v-icon>mdi-code-braces-box</v-icon>
      <v-tooltip activator="parent" location="top">코드 블럭 지정</v-tooltip>
    </v-btn>

    <v-btn icon @click="editor?.chain().focus().toggleBulletList().run()"
      ><v-icon>mdi-format-list-bulleted-type</v-icon>
      <v-tooltip activator="parent" location="top">순서 없는 목록</v-tooltip>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().toggleOrderedList().run()"
      ><v-icon>mdi-format-list-numbered</v-icon>
      <v-tooltip activator="parent" location="top">순서 있는 목록</v-tooltip>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().toggleBlockquote().run()"
      ><v-icon>mdi-format-quote-open</v-icon>
      <v-tooltip activator="parent" location="top">인용 문구</v-tooltip>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().setHorizontalRule().run()"
      ><v-icon>mdi-minus</v-icon>
      <v-tooltip activator="parent" location="top">가로 구분선</v-tooltip>
    </v-btn>

    <v-btn icon @click="editor?.chain().focus().undo().run()"
      ><v-icon>mdi-arrow-u-left-top</v-icon>
      <v-tooltip activator="parent" location="top">방금 작업 취소하기</v-tooltip>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().redo().run()"
      ><v-icon>mdi-arrow-u-right-top</v-icon>
      <v-tooltip activator="parent" location="top">취소한 작업 되돌리기</v-tooltip>
    </v-btn>
    <v-btn icon @click="editor?.chain().focus().unsetAllMarks().run()"
      ><v-icon>mdi-restore</v-icon>
      <v-tooltip activator="parent" location="top">효과 취소</v-tooltip>
    </v-btn>
  </v-toolbar>

  <editor-content :editor="editor"></editor-content>

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
</template>

<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount } from "vue"
import { useEditor, EditorContent } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
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
import { useBoardEditorStore } from "../../../store/board/editor"
import { useEditorImageStore } from "../../../store/board/image"
import { useHomeStore } from "../../../store/home"
import { VideoURL, TableOption } from "../../../interface/editor"
import BoardWriteEditorUploadImageDialog from "./BoardWriteEditorUploadImageDialog.vue"
import BoardWriteEditorAddImageFromDBDialog from "./BoardWriteEditorAddImageFromDBDialog.vue"
import BoardWriteEditorAddImageDialog from "./BoardWriteEditorAddImageDialog.vue"
import BoardWriteEditorAddVideoDialog from "./BoardWriteEditorAddVideoDialog.vue"
import BoardWriteEditorAddTableDialog from "./BoardWriteEditorAddTableDialog.vue"
import "../../../assets/board/editor.scss"

const writeEditor = useBoardEditorStore()
const editorImage = useEditorImageStore()
const home = useHomeStore()
const props = defineProps<{
  modelValue: string
}>()
const emits = defineEmits(["update:modelValue", "updateRealHtml"])

onMounted(() => writeEditor.loadBoardConfig())
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
    StarterKit.configure({
      codeBlock: false /* CodeBlockLowLight 충돌 방지 */,
    }),
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
  ],
  onUpdate: () => {
    let html = editor.value?.getHTML() || ""
    const e = document.querySelector(".tiptap") as HTMLDivElement
    emits("update:modelValue", html)
    emits("updateRealHtml", e.innerHTML)
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
})
</script>

<style scoped>
.write_editor_menu {
  border-left: 1px #dddddd solid;
  border-right: 1px #dddddd solid;
  border-top: 1px #dddddd solid;
}
</style>
