<script setup lang="ts">
import {
  Bold,
  Code,
  Heading2,
  ImagePlus,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-vue-next"
import Image from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { Table } from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import Typography from "@tiptap/extension-typography"
import StarterKit from "@tiptap/starter-kit"
import { EditorContent, useEditor } from "@tiptap/vue-3"
import { onBeforeUnmount, ref, watch } from "vue"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const props = defineProps<{
  modelValue: string
  uploadImages?: (files: File[]) => Promise<string[]>
}>()
const emit = defineEmits<{ "update:modelValue": [value: string] }>()
const linkOpen = ref(false)
const linkUrl = ref("https://")

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({ link: false }),
    LinkExtension.configure({ openOnClick: false, autolink: true }),
    Image.configure({ allowBase64: false }),
    Placeholder.configure({ placeholder: "Share something with the community…" }),
    Typography,
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
  ],
  onUpdate: ({ editor: instance }) => emit("update:modelValue", instance.getHTML()),
  editorProps: {
    handlePaste: (_view, event) => {
      const images = Array.from(event.clipboardData?.files ?? []).filter((file) =>
        file.type.startsWith("image/"),
      )
      if (!images.length || !props.uploadImages) return false
      event.preventDefault()
      void uploadAndInsert(images)
      return true
    },
    handleDrop: (_view, event, _slice, moved) => {
      const images = Array.from(event.dataTransfer?.files ?? []).filter((file) =>
        file.type.startsWith("image/"),
      )
      if (moved || !images.length || !props.uploadImages) return false
      event.preventDefault()
      void uploadAndInsert(images)
      return true
    },
  },
})

const uploadAndInsert = async (files: File[]) => {
  if (!props.uploadImages || !editor.value) return
  const sources = await props.uploadImages(files)
  sources.forEach((src) => editor.value?.chain().focus().setImage({ src }).run())
}

const selectImages = (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files ?? [])
  if (files.length) void uploadAndInsert(files)
  ;(event.target as HTMLInputElement).value = ""
}

const setLink = () => {
  if (!editor.value) return
  const previous = editor.value.getAttributes("link").href as string | undefined
  linkUrl.value = previous ?? "https://"
  linkOpen.value = true
}

const applyLink = () => {
  if (!editor.value) return
  const url = linkUrl.value.trim()
  if (!url) editor.value.chain().focus().extendMarkRange("link").unsetLink().run()
  else editor.value.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  linkOpen.value = false
}

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && editor.value.getHTML() !== value)
      editor.value.commands.setContent(value, { emitUpdate: false })
  },
)
onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
  <div
    class="overflow-hidden rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring"
  >
    <div v-if="editor" class="flex flex-wrap gap-1 border-b bg-muted/45 p-2">
      <Button
        type="button"
        :variant="editor.isActive('bold') ? 'secondary' : 'ghost'"
        size="icon-sm"
        aria-label="Bold"
        @click="editor.chain().focus().toggleBold().run()"
        ><Bold
      /></Button>
      <Button
        type="button"
        :variant="editor.isActive('italic') ? 'secondary' : 'ghost'"
        size="icon-sm"
        aria-label="Italic"
        @click="editor.chain().focus().toggleItalic().run()"
        ><Italic
      /></Button>
      <Button
        type="button"
        :variant="editor.isActive('strike') ? 'secondary' : 'ghost'"
        size="icon-sm"
        aria-label="Strike"
        @click="editor.chain().focus().toggleStrike().run()"
        ><Strikethrough
      /></Button>
      <Button
        type="button"
        :variant="editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'"
        size="icon-sm"
        aria-label="Heading"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        ><Heading2
      /></Button>
      <Button
        type="button"
        :variant="editor.isActive('bulletList') ? 'secondary' : 'ghost'"
        size="icon-sm"
        aria-label="Bullet list"
        @click="editor.chain().focus().toggleBulletList().run()"
        ><List
      /></Button>
      <Button
        type="button"
        :variant="editor.isActive('orderedList') ? 'secondary' : 'ghost'"
        size="icon-sm"
        aria-label="Ordered list"
        @click="editor.chain().focus().toggleOrderedList().run()"
        ><ListOrdered
      /></Button>
      <Button
        type="button"
        :variant="editor.isActive('blockquote') ? 'secondary' : 'ghost'"
        size="icon-sm"
        aria-label="Quote"
        @click="editor.chain().focus().toggleBlockquote().run()"
        ><Quote
      /></Button>
      <Button
        type="button"
        :variant="editor.isActive('codeBlock') ? 'secondary' : 'ghost'"
        size="icon-sm"
        aria-label="Code block"
        @click="editor.chain().focus().toggleCodeBlock().run()"
        ><Code
      /></Button>
      <Button type="button" variant="ghost" size="icon-sm" aria-label="Link" @click="setLink"
        ><Link
      /></Button>
      <label
        v-if="uploadImages"
        class="inline-flex size-8 items-center justify-center rounded-md hover:bg-accent"
        aria-label="Upload images"
        ><ImagePlus class="size-4" /><input
          type="file"
          accept="image/*"
          multiple
          class="sr-only"
          @change="selectImages"
      /></label>
      <span class="mx-1 w-px bg-border" />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Undo"
        :disabled="!editor.can().undo()"
        @click="editor.chain().focus().undo().run()"
        ><Undo2
      /></Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Redo"
        :disabled="!editor.can().redo()"
        @click="editor.chain().focus().redo().run()"
        ><Redo2
      /></Button>
    </div>
    <EditorContent :editor="editor" />
  </div>
  <Dialog
    v-model="linkOpen"
    title="Add a link"
    description="Paste a full web address, or leave it empty to remove the current link."
    width="sm"
  >
    <Input
      v-model="linkUrl"
      type="url"
      placeholder="https://example.com"
      @keydown.enter="applyLink"
    />
    <template #footer>
      <Button variant="ghost" @click="linkOpen = false">Cancel</Button>
      <Button @click="applyLink">Apply link</Button>
    </template>
  </Dialog>
</template>
