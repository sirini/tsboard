<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card elevation="0" rounded="0" class="mx-auto" max-width="1000">
            <v-form fast-fail @submit.prevent>
              <board-header :name="'TODO'" :info="'TODO'"></board-header>
              <alert-bar></alert-bar>
              <v-list class="pa-0">
                <v-list-item class="pa-0 mt-3">
                  <v-text-field
                    v-model="editor.subject"
                    :rules="editor.textRule"
                    class="mt-2"
                    prepend-icon="mdi-pencil-outline"
                    variant="outlined"
                    label="글 제목을 입력해 주세요"
                  ></v-text-field>
                </v-list-item>
                <v-list-item class="pa-0">
                  <v-file-input
                    @change="editor.uploadImageFiles"
                    show-size
                    counter
                    class="pt-3"
                    accept="*/*"
                    multiple
                    variant="outlined"
                    label="첨부할 파일들을 선택해 주세요"
                  >
                    <template v-slot:selection="{ fileNames }">
                      <template v-for="fileName in fileNames" :key="fileName">
                        <v-chip
                          size="small"
                          label
                          color="primary"
                          prepend-icon="mdi-image"
                          class="mt-1 mr-1 mb-1"
                        >
                          {{ fileName }}
                        </v-chip>
                      </template>
                    </template>
                  </v-file-input>
                </v-list-item>
                <v-list-item class="pa-0">
                  <board-write-editor
                    v-model="editor.content"
                    @updateRealHtml="(html: string) => editor.updateRealHtml(html)"
                  ></board-write-editor>
                </v-list-item>
                <v-list-item class="pa-0 mt-3">
                  <v-text-field
                    v-model="editor.tag"
                    :rules="editor.textRule"
                    class="mt-2"
                    prepend-inner-icon="mdi-tag-multiple"
                    label="게시글 내용에 적합한 해시태그를 입력해 주세요 (스페이스/엔터 키 혹은 콤마 키로 추가)"
                    @keyup="editor.updateTagSuggestion"
                    @keyup.space="editor.addTag(editor.tag)"
                    @keyup.,="editor.addTag(editor.tag)"
                    @keyup.enter="editor.addTag(editor.tag)"
                    variant="outlined"
                  >
                    <v-menu activator="parent">
                      <v-list>
                        <v-list-item
                          v-for="(tag, index) in editor.tagSuggestions"
                          :key="index"
                          prepend-icon="mdi-tag-plus"
                          @click="editor.addTag(tag)"
                          >{{ tag }}
                          <v-tooltip activator="parent"> {{ tag }} 태그를 추가합니다 </v-tooltip>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-text-field>
                  <v-card elevation="0" class="mt-2 mb-2">
                    <v-chip
                      v-for="(tag, index) in editor.tags"
                      :key="index"
                      closable
                      @click.close="editor.removeTag(tag)"
                      class="mt-1 ml-1"
                      >{{ tag }}</v-chip
                    >
                  </v-card>
                </v-list-item>
              </v-list>
            </v-form>
            <v-card-actions>
              <v-btn @click="editor.openWriteCancelDialog" prepend-icon="mdi-close"
                >글 작성 취소</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="editor.savePost(list.id)"
                append-icon="mdi-chevron-right"
                >작성 완료하고 보러 가기</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
    <board-write-cancel-dialog @cancel="util.go('boardList', list.id)"></board-write-cancel-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { useBoardListStore } from "../../store/board/list"
import { useUtilStore } from "../../store/util"
import { useBoardEditorStore } from "../../store/board/editor"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardWriteEditor from "../../components/board/write/BoardWriteEditor.vue"
import BoardWriteCancelDialog from "../../components/board/write/BoardWriteCancelDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import AlertBar from "../../components/util/AlertBar.vue"

const list = useBoardListStore()
const util = useUtilStore()
const editor = useBoardEditorStore()
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 54px);
}
</style>
