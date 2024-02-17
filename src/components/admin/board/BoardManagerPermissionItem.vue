<template>
  <v-row>
    <v-col cols="3">
      <v-text-field
        v-model="item"
        variant="outlined"
        type="number"
        density="compact"
        hide-details
        readonly
        prepend-inner-icon="mdi-format-list-numbered"
        append-inner-icon="mdi-chevron-down"
      >
        <v-menu activator="parent" open-on-hover>
          <v-list>
            <v-list-item
              v-for="(_, lv) in 10"
              :key="lv"
              @click="updateLevel(lv)"
              :disabled="authUserOnly && lv < 1"
              :append-icon="item === lv ? 'mdi-check' : ''"
            >
              {{ lv }} 레벨
              <v-chip size="small" color="warning" class="ml-2" v-if="authUserOnly && lv < 1"
                >비회원은 사용불가</v-chip
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-text-field>
    </v-col>
    <v-col class="mt-2">{{ action }} 레벨을 제한합니다. (0 = 비회원, 9 = 최고레벨)</v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useAdminBoardPermissionStore } from "../../../store/admin/board/permission"
import { ACTION_TYPE } from "../../../interface/admin"

const prop = defineProps<{
  type: number
  authUserOnly: boolean
}>()
const emit = defineEmits<{
  update: [level: number]
}>()

const permission = useAdminBoardPermissionStore()
const item = ref<number>(0)
const action = ref<string>("")

// 선택한 레벨로 변경하기
function updateLevel(level: number): void {
  item.value = level
  emit("update", level)
}

watch(
  () => permission.board,
  () => {
    if (prop.type === ACTION_TYPE.LIST) {
      action.value = "글 목록 보기"
      item.value = permission.board.level.list
    } else if (prop.type === ACTION_TYPE.VIEW) {
      action.value = "글 보기"
      item.value = permission.board.level.view
    } else if (prop.type === ACTION_TYPE.WRITE) {
      action.value = "글 작성"
      item.value = permission.board.level.write
    } else if (prop.type === ACTION_TYPE.COMMENT) {
      action.value = "댓글 작성"
      item.value = permission.board.level.comment
    } else {
      action.value = "다운로드"
      item.value = permission.board.level.download
    }
  },
)
</script>
