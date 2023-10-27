<template>
  <v-app>
    <home-header></home-header>
    <v-layout>
      <v-main>
        <v-card :width="board.width" elevation="0" rounded="0" class="mx-auto board">
          <v-form fast-fail @submit.prevent>
            <board-header></board-header>
            <v-alert
              v-if="write.alert.show"
              :type="write.alert.type"
              :text="write.alert.text"
              class="mt-3"
            ></v-alert>
            <v-list class="pa-0">
              <v-list-item class="pa-0 mt-3">
                <v-text-field
                  v-model="write.subject"
                  :rules="write.textRule"
                  class="mt-2"
                  prepend-inner-icon="mdi-pencil-outline"
                  variant="outlined"
                  label="글 제목을 입력해 주세요"
                ></v-text-field>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-file-input
                  @change="write.readSelectedFiles"
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
                <board-write-editor v-model="write.content"></board-write-editor>
              </v-list-item>
              <v-list-item class="pa-0 mt-3">
                <v-text-field
                  v-model="write.tag"
                  :rules="write.textRule"
                  class="mt-2"
                  prepend-inner-icon="mdi-tag-multiple"
                  label="게시글 내용에 적합한 해시태그를 입력해 주세요 (스페이스 키 혹은 콤마로 추가)"
                  @keyup="write.updateTagSuggestion"
                  @keyup.space="write.addTag(write.tag)"
                  @keyup.,="write.addTag(write.tag)"
                  variant="outlined"
                >
                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item
                        v-for="(tag, index) in write.tagSuggestions"
                        :key="index"
                        prepend-icon="mdi-tag-plus"
                        @click="write.addTag(tag)"
                        >{{ tag }}
                        <v-tooltip activator="parent"> {{ tag }} 태그를 추가합니다 </v-tooltip>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-text-field>
                <v-card elevation="0" class="mt-2 mb-2">
                  <v-chip
                    v-for="(tag, index) in write.tags"
                    :key="index"
                    closable
                    @click.close="write.removeTag(tag)"
                    class="mt-1 ml-1"
                    >{{ tag }}</v-chip
                  >
                </v-card>
              </v-list-item>
            </v-list>
          </v-form>
          <v-card-actions>
            <v-btn @click="board.confirmCancelDialog = true" prepend-icon="mdi-close"
              >글 작성 취소</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="write.save(board.id)" append-icon="mdi-chevron-right"
              >작성 완료하고 보러 가기</v-btn
            >
          </v-card-actions>
        </v-card>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
    <board-write-cancel-dialog @cancel="util.go('boardList', board.id)"></board-write-cancel-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { useBoardStore } from "../../store/board"
import { useUtilStore } from "../../store/util"
import { useWriteStore } from "../../store/write"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardWriteEditor from "../../components/board/write/BoardWriteEditor.vue"
import BoardWriteCancelDialog from "../../components/board/write/BoardWriteCancelDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"

const board = useBoardStore()
const util = useUtilStore()
const write = useWriteStore()
</script>

<style scoped>
.board {
  margin-top: 80px;
}
</style>
