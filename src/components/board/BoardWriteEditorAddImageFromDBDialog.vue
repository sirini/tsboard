<template>
  <v-dialog width="500" v-model="board.addImageFromDBDialog" persistent>
    <v-card>
      <v-card-title>기존 이미지 선택</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col v-for="(image, index) in uploadedImages" :key="index" cols="3">
            <v-img
              cover
              height="100"
              aspect-ratio="1/1"
              :src="image"
              @click="add(image)"
              class="pointer"
            >
              <v-tooltip activator="parent" location="top">
                클릭하시면 이 사진을 본문에 추가합니다
              </v-tooltip>
            </v-img>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn block prepend-icon="mdi-close" @click="board.addImageFromDBDialog = false"
          >닫기</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useBoardStore } from "../../store/board"

const emits = defineEmits(["addImageURL"])
const board = useBoardStore()
const uploadedImages = [
  `https://images.unsplash.com/photo-1688494930045-328d0f95efe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3270&q=80`,
  `https://images.unsplash.com/photo-1690402687447-87600bae0364?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3132&q=80`,
  `https://images.unsplash.com/photo-1692871480784-4fd78f25459f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2160&q=80`,
  `https://images.unsplash.com/photo-1685516882750-807fa81a949f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3280&q=80`,
]

// 기존에 업로드한 이미지 추가하기
function add(src: string): void {
  emits("addImageURL", src)
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
