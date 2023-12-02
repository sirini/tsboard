<template>
  <v-card elevation="0">
    <v-list>
      <v-list-item class="mb-2">
        <board-change-point
          :isPayment="point.deal.view.isPayment"
          :amount="point.deal.view.amount"
          name="글보기"
          @update="
            (isPayment: boolean, amount: number) => point.updateViewPointRule(isPayment, amount)
          "
        ></board-change-point>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-point
          :isPayment="point.deal.write.isPayment"
          :amount="point.deal.write.amount"
          name="글쓰기"
          @update="
            (isPayment: boolean, amount: number) => point.updateWritePointRule(isPayment, amount)
          "
        ></board-change-point>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-point
          :isPayment="point.deal.comment.isPayment"
          :amount="point.deal.comment.amount"
          name="댓글 쓰기"
          @update="
            (isPayment: boolean, amount: number) => point.updateCommentPointRule(isPayment, amount)
          "
        ></board-change-point>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-point
          :isPayment="point.deal.download.isPayment"
          :amount="point.deal.download.amount"
          name="다운로드"
          @update="
            (isPayment: boolean, amount: number) => point.updateDownloadPointRule(isPayment, amount)
          "
        ></board-change-point>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useAdminBoardPointStore } from "../../../store/admin/board/point"
import BoardChangePoint from "./BoardChangePoint.vue"

const point = useAdminBoardPointStore()
</script>
