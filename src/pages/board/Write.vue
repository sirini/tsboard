<template>
  <v-card :width="board.width" elevation="0" rounded="0" class="mx-auto">
    <v-form fast-fail @submit.prevent>
      <board-header></board-header>
      <v-alert v-if="showAlertBox" :type="alertType" :text="alertText" class="mt-3"></v-alert>
      <v-list class="pa-0">
        <v-list-item class="pa-0 mt-3">
          <v-text-field
            v-model="subject"
            :rules="util.textRule"
            class="mt-2"
            prepend-icon="mdi-pencil-outline"
            label="글 제목을 입력해 주세요"
          ></v-text-field>
        </v-list-item>
        <v-list-item class="pa-0 mt-3">
          <v-file-input
            @change="util.read"
            show-size
            counter
            accept="*/*"
            multiple
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
      </v-list>
    </v-form>
    <v-card-actions>
      <v-btn @click="board.confirmCancelDialog = true" prepend-icon="mdi-close">글 작성 취소</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="submit" append-icon="mdi-chevron-right"
        >작성 완료하고 보러 가기</v-btn
      >
    </v-card-actions>
  </v-card>
  <board-write-cancel-dialog @cancel="cancel"></board-write-cancel-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useBoardStore } from "../../store/board"
import { useUtilStore } from "../../store/util"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardWriteEditor from "../../components/board/write/BoardWriteEditor.vue"
import BoardWriteCancelDialog from "../../components/board/write/BoardWriteCancelDialog.vue"

const route = useRoute()
const board = useBoardStore()
const util = useUtilStore()
const showAlertBox = ref<boolean>(false)
const alertType = ref<"success" | "error">("error")
const alertText = ref<string>("")
const subject = ref<string>("")
const content = ref<string>("")

// 알림 메시지 보여주기
function showAlert(text: string, type: "success" | "error" = "error"): void {
  alertType.value = type
  alertText.value = text
  showAlertBox.value = true
}

// 게시글 작성하기
function submit(): void {
  if (subject.value.length < 2) {
    showAlert("제목은 2글자 이상 입력해 주세요.")
    return
  }
  if (content.value.length < 3) {
    showAlert("글 내용은 3글자 이상 입력해 주세요.")
    return
  }
  showAlertBox.value = false
}

// 글 작성 취소하기
function cancel(): void {
  board.list(route.params?.id.toString())
}
</script>

<style scoped></style>
