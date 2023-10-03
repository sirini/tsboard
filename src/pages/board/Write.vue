<template>
  <v-container>
    <v-card elevation="0" rounded="0">
      <v-form fast-fail @submit.prevent>
        <board-header></board-header>
        <v-alert v-if="showAlertBox" :type="alertType" :text="alertText" class="mt-3"></v-alert>
        <v-list class="pa-0">
          <v-list-item class="pa-0 mt-3">
            <v-text-field
              :rules="subjectRule"
              v-model="subject"
              label="글 제목을 입력해 주세요"
            ></v-text-field>
          </v-list-item>
          <v-list-item class="pa-0 mt-3">
            <board-write-editor v-model="content"></board-write-editor>
          </v-list-item>
        </v-list>
      </v-form>
      <v-card-actions>
        <v-btn @click="board.confirmCancelDialog = true"
          ><v-icon>mdi-close</v-icon>글 작성 취소</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="write"
          >작성 완료하고 보러 가기 <v-icon>mdi-chevron-right</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
    <board-write-cancel-dialog @cancel="cancel"></board-write-cancel-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useBoardStore } from "../../store/board"
import BoardHeader from "../../components/board/BoardHeader.vue"
import BoardWriteEditor from "../../components/board/BoardWriteEditor.vue"
import BoardWriteCancelDialog from "../../components/board/BoardWriteCancelDialog.vue"

const route = useRoute()
const board = useBoardStore()
const showAlertBox = ref<boolean>(false)
const alertType = ref<"success" | "error">("error")
const alertText = ref<string>("")
const boardId = ref<string>(route.params?.id.toString())
const subject = ref<string>("")
const content = ref<string>("")
const subjectRule = [
  (value: any) => {
    if (value?.length > 1) return true
    return "제목은 2글자 이상 입력해 주세요."
  },
]

// 알림 메시지 보여주기
function showAlert(text: string, type: "success" | "error" = "error"): void {
  alertType.value = type
  alertText.value = text
  showAlertBox.value = true
}

// 게시글 작성하기
function write(): void {
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

// 글 작성 취소하기 시 한 번 더 확인하기
function cancel(): void {
  board.goListPage(boardId.value)
}
</script>

<style scoped></style>
