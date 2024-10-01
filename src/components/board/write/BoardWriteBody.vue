<template>
  <v-container class="wrap">
    <v-card class="mx-auto pa-3" :max-width="editor.config.width" :loading="editor.loading">
      <v-form fast-fail @submit.prevent>
        <board-header :name="editor.config.name" :info="editor.config.info"></board-header>
        <alert-bar></alert-bar>

        <v-checkbox
          v-model="editor.isNotice"
          class="ml-8"
          :label="TEXT[home.lang].SET_NOTICE"
          hide-details
          v-if="editor.isAdmin === true"
        ></v-checkbox>

        <v-checkbox
          v-model="editor.isSecret"
          class="ml-8"
          :label="TEXT[home.lang].SET_SECRET"
          hide-details
        ></v-checkbox>

        <board-write-select-category v-if="editor.config.useCategory"></board-write-select-category>
        <board-write-select-attachments></board-write-select-attachments>

        <board-write-attachments
          v-if="editor.postUid > 0 && editor.attachedFiles.length > 0"
        ></board-write-attachments>

        <v-text-field
          v-model="editor.title"
          :rules="editor.textRule"
          class="pt-3 pb-2"
          prepend-icon="mdi-pencil-outline"
          variant="outlined"
          :label="TEXT[home.lang].FILL_TITLE"
        ></v-text-field>

        <board-write-editor
          v-model="editor.content"
          :type="editor.config.type"
          @updateRealHtml="(html: string) => editor.updateRealHtml(html)"
        ></board-write-editor>

        <board-write-add-tags></board-write-add-tags>
      </v-form>

      <v-divider class="mt-12"></v-divider>
      <v-card-actions class="mt-3 pa-0">
        <v-btn @click="editor.openWriteCancelDialog" prepend-icon="mdi-close" size="small">{{
          TEXT[home.lang].CANCEL
        }}</v-btn>
        <v-btn @click="editor.loadAutoSaved" prepend-icon="mdi-cached" size="small">{{
          TEXT[home.lang].LOAD
        }}</v-btn>

        <v-spacer></v-spacer>

        <v-btn
          v-if="editor.postUid < 1"
          variant="flat"
          color="blue-grey"
          @click="editor.write"
          append-icon="mdi-chevron-right"
          :disabled="auth.user.uid < 1 || editor.loading === true"
          >{{ TEXT[home.lang].SUBMIT }}</v-btn
        >
        <v-btn
          v-else
          variant="flat"
          color="blue-grey"
          @click="editor.modify"
          append-icon="mdi-chevron-right"
          :disabled="auth.user.uid < 1 || editor.loading === true"
          >{{ TEXT[home.lang].MODIFY }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { TEXT } from "../../../messages/pages/board/write"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import BoardWriteAddTags from "../../board/write/BoardWriteAddTags.vue"
import BoardWriteAttachments from "../../board/write/BoardWriteAttachments.vue"
import BoardWriteEditor from "../../board/write/BoardWriteEditor.vue"
import BoardWriteSelectAttachments from "../../board/write/BoardWriteSelectAttachments.vue"
import BoardWriteSelectCategory from "../../board/write/BoardWriteSelectCategory.vue"
import AlertBar from "../../util/AlertBar.vue"
import BoardHeader from "../common/BoardHeader.vue"

const editor = useBoardEditorStore()
const auth = useAuthStore()
const home = useHomeStore()
</script>

<style scoped>
.wrap {
  min-height: calc(100vh - 54px);
}
</style>
