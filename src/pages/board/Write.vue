<template>
  <v-app>
    <home-header></home-header>
    <v-layout>
      <v-main>
        <v-card :width="board.width" elevation="0" rounded="0" class="mx-auto board">
          <v-form fast-fail @submit.prevent>
            <board-header></board-header>
            <v-alert v-if="showAlertBox" :type="alertType" :text="alertText" class="mt-3"></v-alert>
            <v-list class="pa-0">
              <v-list-item class="pa-0 mt-3">
                <v-text-field
                  v-model="subject"
                  :rules="write.textRule"
                  class="mt-2"
                  prepend-inner-icon="mdi-pencil-outline"
                  variant="outlined"
                  label="글 제목을 입력해 주세요"
                ></v-text-field>
              </v-list-item>
              <v-list-item class="pa-0 mt-3">
                <v-file-input
                  @change="write.readSelectedFiles"
                  show-size
                  counter
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
              <v-list-item class="pa-0 mt-3">
                <board-write-editor v-model="content"></board-write-editor>
              </v-list-item>
              <v-list-item class="pa-0 mt-3">
                <v-text-field
                  v-model="tag"
                  :rules="write.textRule"
                  class="mt-2"
                  prepend-inner-icon="mdi-tag-multiple"
                  label="게시글 내용에 적합한 해시태그를 입력해 주세요 (스페이스 키 혹은 콤마로 추가)"
                  @keyup="write.updateTagSuggestion(tag)"
                  @keyup.space="addTag(tag)"
                  @keyup.,="addTag(tag)"
                  variant="outlined"
                >
                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item
                        v-for="(tag, index) in write.tagSuggestions"
                        :key="index"
                        prepend-icon="mdi-tag-plus"
                        @click="addTag(tag)"
                        >{{ tag }}
                        <v-tooltip activator="parent"> {{ tag }} 태그를 추가합니다 </v-tooltip>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-text-field>
                <v-card elevation="0" class="mt-2 mb-2">
                  <v-chip
                    v-for="(tag, index) in tags"
                    :key="index"
                    closable
                    @click.close="removeTag(tag)"
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
            <v-btn color="primary" @click="submit" append-icon="mdi-chevron-right"
              >작성 완료하고 보러 가기</v-btn
            >
          </v-card-actions>
        </v-card>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
    <board-write-cancel-dialog @cancel="cancel"></board-write-cancel-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useBoardStore } from "../../store/board"
import { useUtilStore } from "../../store/util"
import { useWriteStore } from "../../store/write"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardWriteEditor from "../../components/board/write/BoardWriteEditor.vue"
import BoardWriteCancelDialog from "../../components/board/write/BoardWriteCancelDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"

const route = useRoute()
const board = useBoardStore()
const util = useUtilStore()
const write = useWriteStore()
const showAlertBox = ref<boolean>(false)
const alertType = ref<"success" | "error">("error")
const alertText = ref<string>("")
const subject = ref<string>("")
const content = ref<string>("")
const tag = ref<string>("")
const tags = ref<string[]>([])

// 알림 메시지 보여주기
function showAlert(text: string, type: "success" | "error" = "error"): void {
  alertType.value = type
  alertText.value = text
  showAlertBox.value = true
}

// 게시글 작성하기
async function submit(): Promise<void> {
  if (subject.value.length < 2) {
    showAlert("제목은 2글자 이상 입력해 주세요.")
    return
  }
  if (content.value.length < 3) {
    showAlert("글 내용은 3글자 이상 입력해 주세요.")
    return
  }
  showAlertBox.value = false
  const result = await write.save(subject.value, content.value, write.files)
  if (!result) {
    showAlert("글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.")
  }
}

// 글 작성 취소하기
function cancel(): void {
  board.list(route.params?.id.toString())
}

// 추천 태그를 클릭하거나 스페이스/콤마 키 입력시 추가하기
function addTag(value: string): void {
  const target = value.replaceAll(util.filterNoSpace, "")
  const duplicate = tags.value.filter((tag: string) => {
    return tag === target
  })
  if (duplicate.length > 0) {
    util.snack("이미 추가된 태그입니다.")
    tag.value = ""
    return
  }
  tags.value.push(target)
  tag.value = ""
}

// 추가한 태그를 다시 삭제하기
function removeTag(target: string): void {
  tags.value = tags.value.filter((tag: string) => {
    return tag !== target
  })
}
</script>

<style scoped>
.board {
  margin-top: 80px;
}
</style>
