<template>
  <v-container>
    <v-card elevation="0" rounded="0">
      <board-header></board-header>

      <v-list class="pa-0">
        <v-list-item class="list_item pa-0">
          <template v-slot:prepend>
            <span class="col no text-center">123</span>
            <v-divider vertical></v-divider>
            <span class="col cat text-center">news</span>
            <v-divider vertical></v-divider>
          </template>
          <v-list-item-title class="pointer ml-3" @click="board.goViewPage(id, 1)"
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
        <v-btn prepend-icon="mdi-login-variant" @click="auth.goLoginPage">로그인</v-btn>
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
import { useAuthStore } from "../../store/auth"
import { useBoardStore } from "../../store/board"
import BoardHeader from "../../components/board/BoardHeader.vue"
import BoardUserNametag from "../../components/board/BoardUserNametag.vue"

const route = useRoute()
const id = ref<string>(route.params?.id.toString())
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
