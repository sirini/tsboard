<template>
  <v-app :style="bgColor" :theme="COLOR.HOME.THEME">
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <board-write-body></board-write-body>
        <home-footer></home-footer>
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
import BoardWriteBody from "../../components/board/write/BoardWriteBody.vue"
import BoardWriteCancelDialog from "../../components/board/write/BoardWriteCancelDialog.vue"
import BoardWriteLoadingDialog from "../../components/board/write/BoardWriteLoadingDialog.vue"
import { useBoardEditorStore } from "../../store/board/editor"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import HomeFooter from "../home/HomeFooter.vue"
import HomeHeader from "../home/HomeHeader.vue"
import { COLOR } from "../../../tsboard.config"

const route = useRoute()
const util = useUtilStore()
const editor = useBoardEditorStore()
const home = useHomeStore()
const bgColor = `background-color: #${COLOR.HOME.BACKGROUND}`

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
