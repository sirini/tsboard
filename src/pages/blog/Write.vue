<template>
  <v-app theme="dark">
    <blog-header
      :name="editor.config.name"
      :info="editor.config.info"
      :id="editor.id"
    ></blog-header>
    <v-layout class="layout">
      <v-main>
        <board-write-body></board-write-body>
        <blog-footer></blog-footer>
      </v-main>
    </v-layout>
    <board-write-cancel-dialog
      @cancel="util.go(editor.config.type, editor.id)"
    ></board-write-cancel-dialog>
    <board-write-loading-dialog></board-write-loading-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import BlogFooter from "../../components/blog/BlogFooter.vue"
import BlogHeader from "../../components/blog/BlogHeader.vue"
import BoardWriteBody from "../../components/board/write/BoardWriteBody.vue"
import BoardWriteCancelDialog from "../../components/board/write/BoardWriteCancelDialog.vue"
import BoardWriteLoadingDialog from "../../components/board/write/BoardWriteLoadingDialog.vue"
import { useBoardEditorStore } from "../../store/board/editor"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"

const route = useRoute()
const editor = useBoardEditorStore()
const util = useUtilStore()
const home = useHomeStore()

onMounted(async () => {
  await editor.loadBoardConfig()
  if (route.params.no) {
    editor.postUid = parseInt(route.params.no as string)
    await editor.loadOriginalPost()
  }
  home.setGridLayout()
})

watch(
  () => [editor.title, editor.tags],
  () => editor.autoSave(),
)
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
</style>
