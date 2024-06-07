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
import { useBoardEditorStore } from "../../store/board/editor"
import { useUtilStore } from "../../store/util"
import BlogHeader from "../../components/blog/BlogHeader.vue"
import BlogFooter from "../../components/blog/BlogFooter.vue"
import BoardWriteBody from "../../components/board/write/BoardWriteBody.vue"
import BoardWriteCancelDialog from "../../components/board/write/BoardWriteCancelDialog.vue"
import BoardWriteLoadingDialog from "../../components/board/write/BoardWriteLoadingDialog.vue"

const editor = useBoardEditorStore()
const util = useUtilStore()
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
</style>
