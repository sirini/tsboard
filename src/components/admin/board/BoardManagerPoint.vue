<template>
  <v-card elevation="0">
    <v-list>
      <v-list-item class="mb-2">
        <v-row>
          <v-col cols="2" class="text-center">
            <v-btn-toggle v-model="point.view.payment">
              <v-btn
                >충전
                <v-tooltip activator="parent">
                  회원이 글보기 시 {{ point.view.point }} 만큼 포인트를 충전시켜 줍니다.
                </v-tooltip>
              </v-btn>
              <v-btn
                >지불
                <v-tooltip activator="parent">
                  회원이 글보기 시 {{ point.view.point }} 만큼 포인트를 지불하도록 합니다.
                </v-tooltip>
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="point.view.point"
              variant="outlined"
              density="compact"
              hide-details
              append-inner-icon="mdi-content-save"
              @click:append-inner="point.dealView"
            >
              <v-tooltip activator="parent">
                앞에 충전인지 지불인지 선택한 후 값을 입력하고 <v-icon>mdi-content-save</v-icon> 를
                클릭하시면 저장됩니다.
              </v-tooltip>
            </v-text-field>
          </v-col>
          <v-col class="mt-2">
            회원이 글보기 시 포인트를 충전 혹은 지불할 수 있도록 합니다. (0 = 해당없음)
          </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useAdminBoardPointStore } from "../../../store/admin/board/point"

const point = useAdminBoardPointStore()
</script>
