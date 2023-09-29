<template>
  <v-container>
    <v-card elevation="0" rounded="0">
      <v-form fast-fail @submit.prevent>
        <board-header></board-header>
        <v-list>
          <v-list-item>
            <v-list-item-title>
              <v-text-field label="글 제목을 입력해 주세요"></v-text-field>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import BoardHeader from "./BoardHeader.vue"
</script>

<style scoped></style>
