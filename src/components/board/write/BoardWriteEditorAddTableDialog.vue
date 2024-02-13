<template>
  <v-dialog v-model="write.addTableDialog" persistent>
    <v-card width="500" class="mx-auto" :color="home.color.header">
      <v-card-title>표 추가하기</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="dialogBody">
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
        <v-btn prepend-icon="mdi-close" @click="write.addTableDialog = false">닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="add" append-icon="mdi-chevron-right">본문에 추가하기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useWriteStore } from "../../../store/write"
import { useHomeStore } from "../../../store/home"
import { TableOption } from "../../../interface/board"

const write = useWriteStore()
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
.dialogBody {
  background-color: white;
}
</style>
