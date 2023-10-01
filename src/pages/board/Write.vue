<template>
  <v-container>
    <v-card elevation="0" rounded="0">
      <v-form fast-fail @submit.prevent>
        <board-header></board-header>
        <v-list class="pa-0">
          <v-list-item class="pa-0 mt-3">
            <v-text-field :rules="subjectRule" label="글 제목을 입력해 주세요"></v-text-field>
          </v-list-item>
          <v-list-item class="pa-0 mt-3">
            <board-write-editor v-model="content"></board-write-editor>
          </v-list-item>
        </v-list>
      </v-form>
      <v-card-actions>
        <v-btn><v-icon>mdi-close</v-icon>글 작성 취소</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary">작성 완료하고 보러 가기 <v-icon>mdi-chevron-right</v-icon></v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue"
import BoardHeader from "../../components/board/BoardHeader.vue"
import BoardWriteEditor from "../../components/board/BoardWriteEditor.vue"

const content = ref<string>("")
const subjectRule = [
  (value: any) => {
    if (value?.length > 1) return true
    return "제목은 2글자 이상 입력해 주세요."
  },
]
</script>

<style scoped></style>
