<template>
  <v-card elevation="0" rounded="0">
    <v-list>
      <v-list-item class="mb-2">
        <board-manager-point-item
          :type="ACTION_TYPE.VIEW"
          @update="(isPayment: boolean, amount: string) => point.updateViewPoint(isPayment, amount)"
        ></board-manager-point-item>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-manager-point-item
          :type="ACTION_TYPE.WRITE"
          @update="
            (isPayment: boolean, amount: string) => point.updateWritePoint(isPayment, amount)
          "
        ></board-manager-point-item>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-manager-point-item
          :type="ACTION_TYPE.COMMENT"
          @update="
            (isPayment: boolean, amount: string) => point.updateCommentPoint(isPayment, amount)
          "
        ></board-manager-point-item>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-manager-point-item
          :type="ACTION_TYPE.DOWNLOAD"
          @update="
            (isPayment: boolean, amount: string) => point.updateDownloadPoint(isPayment, amount)
          "
        >
        </board-manager-point-item>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useAdminStore } from "../../../store/admin/common"
import { useAuthStore } from "../../../store/user/auth"
import { useAdminBoardPointStore } from "../../../store/admin/board/point"
import BoardManagerPointItem from "./BoardManagerPointItem.vue"
import { ACTION_TYPE } from "../../../interface/admin"

const admin = useAdminStore()
const auth = useAuthStore()
const point = useAdminBoardPointStore()
onMounted(() => {
  if (auth.user.uid !== 1) {
    admin.error(`그룹 관리자 이상만 사용 가능합니다.`, 10_000)
    return
  }
  point.loadPointConfig()
})
</script>
