<template>
  <v-card :width="board.width" elevation="0" rounded="0" class="mx-auto">
    <board-header></board-header>

    <v-list class="pa-0">
      <v-list-item class="list_item pa-0">
        <template v-slot:prepend>
          <span class="col no text-center">123</span>
          <v-divider vertical></v-divider>
          <span class="col cat text-center">news</span>
          <v-divider vertical></v-divider>
        </template>
        <v-list-item-title class="pointer ml-3" @click="board.view(route.params?.id.toString(), 1)"
          >제목입니다.
          <v-icon size="small" color="grey">mdi-image-outline</v-icon>
          <v-chip class="ml-2" size="small" color="blue">21</v-chip>
        </v-list-item-title>
        <template v-slot:append>
          <board-user-nametag></board-user-nametag>
          <span class="col view text-center"
            ><v-icon size="small">mdi-eye-outline</v-icon> 1024</span
          >
          <v-divider vertical></v-divider>
          <span class="col heart text-center"
            ><v-icon size="small" color="red">mdi-heart-outline</v-icon> 8</span
          >
          <v-divider vertical></v-divider>
          <span class="col date text-center">23.09.29</span>
        </template>
      </v-list-item>
    </v-list>

    <v-card-actions>
      <v-btn prepend-icon="mdi-text-search-variant" @click="">
        검색
        <v-menu activator="parent" :close-on-content-click="false">
          <board-list-search></board-list-search>
        </v-menu>
      </v-btn>
      <v-spacer></v-spacer>
      <v-pagination :length="5"></v-pagination>
      <v-spacer></v-spacer>
      <v-btn
        prepend-icon="mdi-pencil"
        variant="text"
        @click="board.write(route.params?.id.toString())"
        >새글쓰기</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAuthStore } from "../../store/auth"
import { useBoardStore } from "../../store/board"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardUserNametag from "../../components/board/common/BoardUserNametag.vue"
import BoardListSearch from "../../components/board/list/BoardListSearch.vue"

const route = useRoute()
const auth = useAuthStore()
const board = useBoardStore()
</script>

<style type="scss" scoped>
.list_item {
  border-bottom: 1px #ddd solid;

  .col {
    color: #828282;
    font-size: 0.85em;
  }
  .pointer {
    cursor: pointer;
  }
  .no {
    width: 70px;
  }
  .cat {
    width: 100px;
  }
  .view {
    width: 100px;
  }
  .heart {
    width: 50px;
  }
  .date {
    width: 80px;
  }
}
</style>
