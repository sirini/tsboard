<template>
  <v-row>
    <v-col cols="3">
      <v-btn-toggle v-model="type" mandatory>
        <v-btn color="blue" :value="false"
          >충전
          <v-tooltip activator="parent">
            회원이 {{ name }} 시 {{ target }} 만큼 포인트를 충전시켜 줍니다.
          </v-tooltip>
        </v-btn>
        <v-btn color="red" :value="true"
          >차감
          <v-tooltip activator="parent">
            회원이 {{ name }} 시 {{ target }} 만큼 포인트를 지불하도록 합니다.
          </v-tooltip>
        </v-btn>
      </v-btn-toggle>
    </v-col>

    <v-col cols="3">
      <v-text-field
        v-model="target"
        type="number"
        variant="outlined"
        density="compact"
        hide-details
        append-inner-icon="mdi-content-save"
        @click:append-inner="update"
        @keyup.enter="update"
      >
        <v-tooltip activator="parent">
          앞에 충전인지 지불인지 선택한 후 값을 입력하고 <v-icon>mdi-content-save</v-icon> 를
          클릭하시면 저장됩니다.
        </v-tooltip>
      </v-text-field>
    </v-col>
    <v-col class="mt-2"> {{ name }} 시 포인트를 충전 혹은 차감 합니다. (0 = 해당없음) </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAdminStore } from "../../../store/admin/common"

const admin = useAdminStore()
const props = defineProps<{
  isPayment: boolean
  amount: number
  name: string
}>()
const emits = defineEmits<{
  update: [isPayment: boolean, amount: number]
}>()
const type = ref<boolean>(props.isPayment)
const target = ref<string>(props.amount.toString())

// 포인트, 지불/충전 변경
function update(): void {
  const amount = parseInt(target.value)
  if (amount < 0 || amount > 10000) {
    admin.error("포인트는 0 이상 10000 이하로 지정해 주세요.")
    target.value = "0"
    return
  }
  emits("update", type.value, amount)
}
</script>
