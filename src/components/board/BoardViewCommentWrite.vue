<template>
  <v-textarea rounded="0" :label="label" autogrow hide-details class="mt-2"></v-textarea>
  <v-btn block append-icon="mdi-chevron-right" variant="tonal" color="primary" rounded="0"
    >댓글 작성하기</v-btn
  >
</template>

<script setup lang="ts">
const label = "댓글은 로그인 후 작성 하실 수 있습니다."
</script>
