<template>
  <v-container class="wrap">
    <board-header :config="editor.config"></board-header>

    <v-card
      class="mx-auto pa-3 mt-5"
      :max-width="editor.config.width"
      :loading="editor.loading"
      rounded="xl"
    >
      <v-form fast-fail @submit.prevent>
        <v-list class="pl-2 pr-2"><alert-bar></alert-bar></v-list>

        <v-row>
          <v-col v-if="editor.isAdmin === true">
            <v-checkbox
              v-model="editor.isNotice"
              :label="TEXT[home.lang].SET_NOTICE"
              hide-details
            ></v-checkbox
          ></v-col>
          <v-col>
            <v-checkbox
              v-model="editor.isSecret"
              :label="TEXT[home.lang].SET_SECRET"
              hide-details
            ></v-checkbox
          ></v-col>
        </v-row>

        <board-write-select-attachments></board-write-select-attachments>
        <board-write-attachments
          v-if="editor.postUid > 0 && editor.attachedFiles.length > 0"
        ></board-write-attachments>

        <v-list-item class="pa-0">
          <template v-slot:prepend v-if="editor.config.useCategory">
            <board-write-select-category class="pt-3 mr-2"></board-write-select-category>
          </template>

          <v-text-field
            v-model="editor.title"
            :rules="editor.textRule"
            hide-details
            class="pt-3"
            prepend-inner-icon="mdi-pencil-outline"
            variant="outlined"
            :label="TEXT[home.lang].FILL_TITLE"
            rounded="pill"
          ></v-text-field>
        </v-list-item>

        <v-list-item class="pa-0 pb-3">
          <template v-slot:prepend>
            <trade-write-select-category class="pt-3 mr-2"></trade-write-select-category>
          </template>

          <v-text-field
            v-model="trade.brand"
            :rules="editor.textRule"
            class="pt-3"
            prepend-inner-icon="mdi-apple"
            hide-details
            variant="outlined"
            :label="TXT_TRADE[home.lang].FORM_BRAND"
            rounded="pill"
          ></v-text-field>
        </v-list-item>

        <board-write-editor
          v-model="editor.content"
          :type="editor.config.type"
          :loading="false"
          @updateRealHtml="(html: string) => editor.updateRealHtml(html)"
        ></board-write-editor>

        <board-write-add-tags></board-write-add-tags>
      </v-form>

      <v-divider class="mt-12"></v-divider>
      <v-card-actions class="mt-3 pa-0">
        <v-btn
          @click="editor.openWriteCancelDialog"
          prepend-icon="mdi-close"
          size="small"
          rounded="pill"
          >{{ TEXT[home.lang].CANCEL }}</v-btn
        >
        <v-btn
          @click="editor.loadAutoSaved"
          prepend-icon="mdi-cached"
          size="small"
          rounded="pill"
          >{{ TEXT[home.lang].LOAD }}</v-btn
        >

        <v-spacer></v-spacer>

        <v-btn
          v-if="editor.postUid < 1"
          variant="flat"
          :color="COLOR.HOME.MAIN"
          @click="write"
          append-icon="mdi-chevron-right"
          :disabled="auth.user.uid < 1 || editor.loading === true"
          rounded="pill"
          >{{ TEXT[home.lang].SUBMIT }}</v-btn
        >
        <v-btn
          v-else
          variant="flat"
          :color="COLOR.HOME.MAIN"
          @click="modify"
          append-icon="mdi-chevron-right"
          :disabled="auth.user.uid < 1 || editor.loading === true"
          rounded="pill"
          >{{ TEXT[home.lang].MODIFY }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { COLOR } from "../../../../tsboard.config"
import { TEXT } from "../../../messages/pages/board/write"
import { TEXT as TXT_TRADE } from "../../../messages/pages/board/trade"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import BoardWriteAddTags from "../../board/write/BoardWriteAddTags.vue"
import BoardWriteAttachments from "../../board/write/BoardWriteAttachments.vue"
import BoardWriteEditor from "../../board/write/BoardWriteEditor.vue"
import BoardWriteSelectAttachments from "../../board/write/BoardWriteSelectAttachments.vue"
import BoardWriteSelectCategory from "../../board/write/BoardWriteSelectCategory.vue"
import TradeWriteSelectCategory from "./TradeWriteSelectCategory.vue"
import AlertBar from "../../util/AlertBar.vue"
import BoardHeader from "../common/BoardHeader.vue"
import { useUtilStore } from "../../../store/util"
import { useTradeStore } from "../../../store/board/trade"

const editor = useBoardEditorStore()
const auth = useAuthStore()
const home = useHomeStore()
const util = useUtilStore()
const trade = useTradeStore()

onMounted(() => {
  window.setInterval(editor.autoSave, 10_000)
})

// 게시글 작성 및 글보기로 이동
async function write(): Promise<void> {
  const postUid = await editor.write()
  if (postUid > 0) {
    await trade.write(postUid)
    util.go(editor.config.type, editor.id, postUid)
  }
}

// 게시글 수정 및 글보기로 이동
async function modify(): Promise<void> {
  const postUid = await editor.modify()
  if (postUid > 0) {
    await trade.modify(postUid)
    util.go(editor.config.type, editor.id, postUid)
  }
}
</script>

<style scoped>
.wrap {
  min-height: calc(100vh - 54px);
}
</style>
