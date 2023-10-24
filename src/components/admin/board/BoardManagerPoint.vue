<template>
  <v-card elevation="0">
    <v-list>
      <v-list-item class="mb-2">
        <board-change-point
          :payment="point.view.payment"
          :point="point.view.point"
          name="글보기"
          @update="(payment: 0 | 1, newPoint: number) => point.deal(ACTION.VIEW, payment, newPoint)"
        ></board-change-point>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-point
          :payment="point.write.payment"
          :point="point.write.point"
          name="글쓰기"
          @update="
            (payment: 0 | 1, newPoint: number) => point.deal(ACTION.WRITE, payment, newPoint)
          "
        ></board-change-point>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-point
          :payment="point.comment.payment"
          :point="point.comment.point"
          name="댓글 쓰기"
          @update="
            (payment: 0 | 1, newPoint: number) => point.deal(ACTION.COMMENT, payment, newPoint)
          "
        ></board-change-point>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-point
          :payment="point.download.payment"
          :point="point.download.point"
          name="다운로드"
          @update="
            (payment: 0 | 1, newPoint: number) => point.deal(ACTION.DOWNLOAD, payment, newPoint)
          "
        ></board-change-point>
      </v-list-item>
      <v-divider></v-divider>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useAdminBoardPointStore, ACTION } from "../../../store/admin/board/point"
import BoardChangePoint from "./BoardChangePoint.vue"

const point = useAdminBoardPointStore()
</script>
