<template>
  <v-row>
    <v-col cols="3">
      <v-btn-toggle v-model="isPayment" mandatory>
        <v-btn color="blue" :value="false"
          >충전
          <v-tooltip activator="parent"
            >{{ action }} 시 {{ amount }} 만큼 포인트를 충전시켜 줍니다.</v-tooltip
          >
        </v-btn>
        <v-btn color="red" :value="true">
          차감
          <v-tooltip activator="parent"
            >{{ action }} 시 {{ amount }} 만큼 포인트를 차감합니다.</v-tooltip
          >
        </v-btn>
        <v-btn :value="true" @click="setToZero">
          리셋
          <v-tooltip activator="parent">충전 혹은 차감 없음을 선택합니다.</v-tooltip>
        </v-btn>
      </v-btn-toggle>
    </v-col>

    <v-col cols="3">
      <v-text-field
        v-model="amount"
        type="number"
        variant="outlined"
        density="compact"
        hide-details
        append-inner-icon="mdi-content-save"
        @click:append-inner="emit('update', isPayment, amount)"
        @keyup.enter="emit('update', isPayment, amount)"
      >
        <v-tooltip activator="parent">
          {{ action }} 시 {{ amount }} 만큼 {{ isPayment ? "지불" : "충전" }} 하도록 저장하려면
          <v-icon>mdi-content-save</v-icon> 버튼 혹은 엔터키를 입력해 주세요.
        </v-tooltip>
      </v-text-field>
    </v-col>
    <v-col class="mt-2">{{ action }} 시 포인트를 충전 혹은 차감합니다. (0 = 해당없음)</v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useAdminBoardPointStore } from "../../../store/admin/board/point"
import { ADMIN_ACTION } from "../../../interface/admin_interface"

const prop = defineProps<{
  type: number
}>()
const emit = defineEmits<{
  update: [isPayment: boolean, amount: string]
}>()

const point = useAdminBoardPointStore()
const isPayment = ref<boolean>(false)
const amount = ref<string>("0")
const action = ref<string>("")

// 충전 혹은 차감 모두 해당없음으로 설정
function setToZero(): void {
  emit("update", true, "0")
  amount.value = "0"
}

watch(
  () => point.board,
  () => {
    if (prop.type === ADMIN_ACTION.VIEW) {
      action.value = "글 보기"
      isPayment.value = point.board.view < 0
      amount.value = Math.abs(point.board.view).toString()
    } else if (prop.type === ADMIN_ACTION.WRITE) {
      action.value = "글 작성"
      isPayment.value = point.board.write < 0
      amount.value = Math.abs(point.board.write).toString()
    } else if (prop.type === ADMIN_ACTION.COMMENT) {
      action.value = "댓글 작성"
      isPayment.value = point.board.comment < 0
      amount.value = Math.abs(point.board.comment).toString()
    } else {
      action.value = "다운로드"
      isPayment.value = point.board.download < 0
      amount.value = Math.abs(point.board.download).toString()
    }
  },
)
</script>
