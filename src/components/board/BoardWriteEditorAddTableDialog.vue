<template>
  <v-dialog width="500" v-model="board.addTableDialog" persistent>
    <v-card>
      <v-card-title>표 추가하기</v-card-title>
      <v-divider></v-divider>
      <v-alert
        v-model="alert"
        type="error"
        closable
        class="ma-3"
        title="잘못된 값을 입력하셨습니다. 행과 열의 개수를 다시 확인해 주세요."
      >
      </v-alert>
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
          </v-col> </v-row
        ><v-checkbox v-model="withHeaderRow" label="표 상단에 헤더 영역 포함"></v-checkbox>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="board.addTableDialog = false">닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="add" append-icon="mdi-chevron-right">본문에 추가하기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useBoardStore } from "../../store/board"

const board = useBoardStore()
const emits = defineEmits(["addTable"])
const alert = ref<boolean>(false)
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
