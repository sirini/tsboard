<template>
  <v-container>
    <v-card elevation="0" rounded="0">
      <v-form fast-fail @submit.prevent>
        <board-header></board-header>
        <v-list>
          <v-list-item>
            <v-text-field hide-details label="글 제목을 입력해 주세요"></v-text-field>
          </v-list-item>
          <v-list-item>
            <board-write-editor v-model="content"></board-write-editor>
          </v-list-item>
        </v-list>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue"
import BoardHeader from "../../components/board/BoardHeader.vue"
import BoardWriteEditor from "../../components/board/BoardWriteEditor.vue"

const content = ref<string>("")
</script>

<style scoped></style>
