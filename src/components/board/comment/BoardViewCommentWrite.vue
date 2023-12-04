<template>
  <v-card elevation="0" rounded="0" class="mt-2">
    <board-write-editor
      v-model="comment.content"
      @updateRealHtml="(html: string) => comment.updateRealHtml(html)"
    ></board-write-editor>

    <v-card-actions>
      <v-btn
        prepend-icon="mdi-new-box"
        @click="comment.resetCommentMode"
        v-show="comment.modifyTarget > 0 || comment.replyTarget > 0"
        >새 댓글 작성으로 설정
        <v-tooltip activator="parent">
          작성중인 본문 내용을 모두 삭제하고, 새 댓글 작성 모드로 변경합니다. (답글달기,
          수정하기에서 새 댓글로 변경하고 싶을 때 클릭!)
        </v-tooltip>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn append-icon="mdi-chevron-right" color="primary" @click="comment.save">{{
        comment.button
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useCommentStore } from "../../../store/comment"
import BoardWriteEditor from "../write/BoardWriteEditor.vue"

const comment = useCommentStore()
</script>
