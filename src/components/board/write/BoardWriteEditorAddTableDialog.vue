<template>
  <v-dialog v-model="editor.addTableDialog" persistent>
    <v-card width="600" class="mx-auto" rounded="lg" :color="home.color.header">
      <v-card-title>표 추가하기</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="rows"
              class="mr-2"
              variant="solo"
              label="행 (row) 개수"
              prepend-inner-icon="mdi-table-row-height"
              :rules="cellRule"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="cols"
              class="ml-2"
              variant="solo"
              label="열 (column) 개수"
              prepend-inner-icon="mdi-table-column-width"
              :rules="cellRule"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-checkbox v-model="withHeaderRow" label="표 상단에 헤더 영역 포함"></v-checkbox>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="editor.addTableDialog = false">닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="add" append-icon="mdi-chevron-right">본문에 추가하기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useHomeStore } from "../../../store/home"
import { TableOption } from "../../../interface/editor"

const editor = useBoardEditorStore()
const home = useHomeStore()
const emits = defineEmits<{
  addTable: [option: TableOption]
}>()
const rows = ref<number>(3)
const cols = ref<number>(3)
const withHeaderRow = ref<boolean>(true)
const cellRule = [
  (value: number) => {
    return (value > 0 && value < 100) || "잘못된 개수 지정입니다."
  },
]

// 표 추가하기
function add(): void {
  emits("addTable", { rows: rows.value, cols: cols.value, withHeaderRow: withHeaderRow.value })
}
</script>

<style scoped>
/** 다이얼로그 배경 조정 */
.v-overlay--active {
  animation: tsboardCustomOverlay 0.5s ease-in forwards;
}
@keyframes tsboardCustomOverlay {
  from {
    backdrop-filter: blur(0px);
    background: rgba(0, 0, 0, 0);
  }
  to {
    backdrop-filter: blur(2px);
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
