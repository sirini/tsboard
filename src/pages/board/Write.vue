<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card
            elevation="0"
            rounded="0"
            class="mx-auto"
            :max-width="editor.config.width"
            :loading="editor.loading"
          >
            <v-form fast-fail @submit.prevent>
              <board-header :name="editor.config.name" :info="editor.config.info"></board-header>
              <alert-bar></alert-bar>

              <v-list class="pa-0">
                <v-list-item class="pa-0">
                  <v-checkbox
                    v-model="editor.isNotice"
                    class="ml-8"
                    label="공지글로 등록 (관리자만 가능)"
                    hide-details
                  ></v-checkbox>
                </v-list-item>

                <board-write-select-category
                  v-if="editor.config.useCategory"
                ></board-write-select-category>

                <board-write-select-attachments></board-write-select-attachments>

                <board-write-attachments
                  v-if="editor.postUid > 0 && editor.attachedFiles.length > 0"
                ></board-write-attachments>

                <v-list-item class="pa-0">
                  <v-text-field
                    v-model="editor.title"
                    :rules="editor.textRule"
                    class="pt-3 pb-2"
                    prepend-icon="mdi-pencil-outline"
                    variant="outlined"
                    label="글 제목을 입력해 주세요"
                  ></v-text-field>
                </v-list-item>

                <v-list-item class="pa-0">
                  <board-write-editor
                    v-model="editor.content"
                    @updateRealHtml="(html: string) => editor.updateRealHtml(html)"
                  ></board-write-editor>
                </v-list-item>

                <board-write-add-tags></board-write-add-tags>
              </v-list>
            </v-form>

            <v-divider class="mt-12"></v-divider>
            <v-card-actions>
              <v-btn @click="editor.openWriteCancelDialog" prepend-icon="mdi-close"
                >글 작성 취소</v-btn
              >

              <v-spacer></v-spacer>

              <v-btn
                v-if="editor.postUid < 1"
                color="primary"
                @click="editor.write"
                append-icon="mdi-chevron-right"
                :disabled="auth.user.uid < 1"
                >작성 완료하고 보러 가기</v-btn
              >
              <v-btn
                v-else
                color="primary"
                @click="editor.modify"
                append-icon="mdi-chevron-right"
                :disabled="auth.user.uid < 1"
                >수정 완료하고 보러 가기</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
    <board-write-cancel-dialog
      @cancel="util.go('boardList', editor.id)"
    ></board-write-cancel-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRoute } from "vue-router"
import { useAuthStore } from "../../store/user/auth"
import { useUtilStore } from "../../store/util"
import { useBoardEditorStore } from "../../store/board/editor"
import { useHomeStore } from "../../store/home"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardWriteSelectCategory from "../../components/board/write/BoardWriteSelectCategory.vue"
import BoardWriteSelectAttachments from "../../components/board/write/BoardWriteSelectAttachments.vue"
import BoardWriteAttachments from "../../components/board/write/BoardWriteAttachments.vue"
import BoardWriteEditor from "../../components/board/write/BoardWriteEditor.vue"
import BoardWriteAddTags from "../../components/board/write/BoardWriteAddTags.vue"
import BoardWriteCancelDialog from "../../components/board/write/BoardWriteCancelDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import AlertBar from "../../components/util/AlertBar.vue"

const route = useRoute()
const auth = useAuthStore()
const util = useUtilStore()
const editor = useBoardEditorStore()
const home = useHomeStore()

onMounted(() => {
  if (route.params.no) {
    editor.postUid = parseInt(route.params.no as string)
    editor.loadOriginalPost()
  }
  home.setGridLayout()
})
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 54px);
}
</style>
