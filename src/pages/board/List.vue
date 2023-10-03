<template>
  <v-container>
    <v-card elevation="0" rounded="0">
      <board-header></board-header>

      <v-list class="pa-0">
        <v-list-item class="list_item" @click="board.goViewPage(id, 1)">
          <template v-slot:prepend>
            <span class="col mr-4">123</span>
            <v-divider vertical></v-divider>
            <span class="col ml-4 mr-4">news</span>
            <v-divider vertical></v-divider>
          </template>
          <v-list-item-title class="ml-3"
            >제목입니다.
            <v-icon size="small" color="grey">mdi-image-outline</v-icon></v-list-item-title
          >
          <template v-slot:append>
            <board-user-nametag></board-user-nametag>
            <span class="col ml-4 mr-4"><v-icon size="small">mdi-eye-outline</v-icon> 1024</span>
            <v-divider vertical></v-divider>
            <span class="col ml-4 mr-4"><v-icon size="small">mdi-heart-outline</v-icon> 8</span>
            <v-divider vertical></v-divider>
            <span class="col ml-4 mr-4"><v-icon size="small">mdi-comment-outline</v-icon> 21</span>
            <v-divider vertical></v-divider>
            <span class="col ml-4">23.09.29</span>
          </template>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-btn append-icon="mdi-chevron-right">다음 페이지</v-btn>
        <v-spacer></v-spacer>
        <v-pagination :length="5"></v-pagination>
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-pencil" @click="board.goWritePage(id)">글쓰기</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useBoardStore } from "../../store/board"
import BoardHeader from "../../components/board/BoardHeader.vue"
import BoardUserNametag from "../../components/board/BoardUserNametag.vue"

const route = useRoute()
const id = ref<string>(route.params?.id.toString())
const board = useBoardStore()
</script>

<style type="scss" scoped>
.list_item {
  border-bottom: 1px #ddd solid;

  .col {
    color: #828282;
    font-size: 0.85em;
  }
}
</style>
