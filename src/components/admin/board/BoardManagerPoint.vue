<template>
  <v-card elevation="0">
    <v-list>
      <v-list-item class="mb-2">
        <v-row>
          <v-col cols="3">
            <v-btn-toggle v-model="point.board.view.isPayment" mandatory>
              <v-btn color="blue" :value="false"
                >충전
                <v-tooltip activator="parent">
                  회원이 글보기 시 {{ point.board.view.amount }} 만큼 포인트를 충전시켜 줍니다.
                </v-tooltip>
              </v-btn>
              <v-btn color="red" :value="true"
                >차감
                <v-tooltip activator="parent">
                  회원이 글보기 시 {{ point.board.view.amount }} 만큼 포인트를 지불하도록 합니다.
                </v-tooltip>
              </v-btn>
            </v-btn-toggle>
          </v-col>

          <v-col cols="3">
            <v-text-field
              v-model="point.boardView"
              type="number"
              variant="outlined"
              density="compact"
              hide-details
              append-inner-icon="mdi-content-save"
              @click:append-inner="point.updateViewPoint"
              @keyup.enter=""
            >
              <v-tooltip activator="parent">
                앞에 충전인지 지불인지 선택한 후 값을 입력하고 <v-icon>mdi-content-save</v-icon> 를
                클릭하시면 저장됩니다.
              </v-tooltip>
            </v-text-field>
          </v-col>
          <v-col class="mt-2"> 글보기 시 포인트를 충전 혹은 차감 합니다. (0 = 해당없음) </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-point
          :isPayment="point.board.write.isPayment"
          :amount="point.board.write.amount"
          name="글쓰기"
          @update="
            (isPayment: boolean, amount: number) => point.updateWritePointRule(isPayment, amount)
          "
        ></board-change-point>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-point
          :isPayment="point.board.comment.isPayment"
          :amount="point.board.comment.amount"
          name="댓글 쓰기"
          @update="
            (isPayment: boolean, amount: number) => point.updateCommentPointRule(isPayment, amount)
          "
        ></board-change-point>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-point
          :isPayment="point.board.download.isPayment"
          :amount="point.board.download.amount"
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
import { onMounted } from "vue"
import { useAdminBoardPointStore } from "../../../store/admin/board/point"
import BoardChangePoint from "./BoardChangePoint.vue"

const point = useAdminBoardPointStore()
onMounted(() => point.loadPointConfig())
</script>
