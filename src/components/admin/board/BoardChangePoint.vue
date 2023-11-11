<template>
  <v-row>
    <v-col cols="2" class="text-center">
      <v-btn-toggle v-model="type">
        <v-btn color="blue"
          >충전
          <v-tooltip activator="parent">
            회원이 {{ name }} 시 {{ parseInt(target) }} 만큼 포인트를 충전시켜 줍니다.
          </v-tooltip>
        </v-btn>
        <v-btn color="red"
          >차감
          <v-tooltip activator="parent">
            회원이 {{ name }} 시 {{ parseInt(target) }} 만큼 포인트를 지불하도록 합니다.
          </v-tooltip>
        </v-btn>
      </v-btn-toggle>
    </v-col>
    <v-col cols="2">
      <v-text-field
        v-model="target"
        variant="outlined"
        density="compact"
        hide-details
        append-inner-icon="mdi-content-save"
        @click:append-inner="update"
      >
        <v-tooltip activator="parent">
          앞에 충전인지 지불인지 선택한 후 값을 입력하고 <v-icon>mdi-content-save</v-icon> 를
          클릭하시면 저장됩니다.
        </v-tooltip>
      </v-text-field>
    </v-col>
    <v-col class="mt-2">
      회원이 {{ name }} 시 포인트를 충전 혹은 차감할 수 있도록 합니다. (0 = 해당없음)
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAdminStore } from "../../../store/admin/common"
import { useAdminBoardPointStore } from "../../../store/admin/board/point"

const admin = useAdminStore()
const point = useAdminBoardPointStore()
const props = defineProps<{
  payment: 0 | 1
  point: number
  name: string
}>()
const emits = defineEmits<{
  update: [payment: 0 | 1, point: number]
}>()
const type = ref<0 | 1>(props.payment)
const target = ref<string>(props.point.toString())

// 포인트, 지불/충전 변경
function update(): void {
  const point = parseInt(target.value)
  if (point < 1 || point > 10000) {
    admin.snack("포인트는 1 이상 10000 이하로 지정해 주세요.", "error")
    target.value = "0"
    return
  }
  emits("update", type.value, parseInt(target.value))
}
</script>
