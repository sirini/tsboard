<template>
  <v-row no-gutters>
    <v-col class="pa-1">
      <v-card class="mt-3 title">
        <template v-slot:title>방문자수</template>
        <template v-slot:append>
          <v-chip
            size="small"
            :color="home.color.header"
            prepend-icon="mdi-account-arrow-right-outline"
            >오늘 {{ dashboard.visit.values.at(-1) || 0 }}명</v-chip
          >
        </template>
        <v-divider></v-divider>
        <v-sheet class="mx-auto" color="blue-grey-lighten-3">
          <v-sparkline
            :model-value="dashboard.visit.values"
            color="white"
            :line-width="3"
            :padding="16"
            smooth
            :height="150"
            stroke-linecap="round"
            auto-draw
          ></v-sparkline>
        </v-sheet>

        <v-card-actions class="pa-0 ml-3 mr-3">
          <v-chip
            color="blue-grey-lighten-2"
            prepend-icon="mdi-account-arrow-right-outline"
            size="small"
            >어제 {{ dashboard.visit.values.at(-2) || 0 }}명</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-account-group-outline" size="small"
            >총합 {{ util.num(dashboard.visit.total) }}명</v-chip
          >
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col class="pa-1">
      <v-card class="mt-3 title">
        <template v-slot:title>회원 수</template>
        <template v-slot:append>
          <v-chip
            size="small"
            :color="home.color.header"
            prepend-icon="mdi-account-multiple-plus-outline"
            >오늘 {{ dashboard.member.values.at(-1) || 0 }}명</v-chip
          >
        </template>
        <v-divider></v-divider>
        <v-sheet class="mx-auto" color="blue-grey-lighten-3">
          <v-sparkline
            :model-value="dashboard.member.values"
            color="white"
            :line-width="3"
            :padding="16"
            smooth
            :height="150"
            stroke-linecap="round"
            auto-draw
          ></v-sparkline>
        </v-sheet>
        <v-card-actions class="pa-0 ml-3 mr-3">
          <v-chip
            color="blue-grey-lighten-2"
            prepend-icon="mdi-account-multiple-plus-outline"
            size="small"
            >어제 {{ dashboard.member.values.at(-2) || 0 }}명</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip
            color="blue-grey-lighten-2"
            prepend-icon="mdi-account-multiple-outline"
            size="small"
            >총합 {{ util.num(dashboard.member.total) }}명</v-chip
          >
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col class="pa-1">
      <v-card class="mt-3 title">
        <template v-slot:title>게시글</template>
        <template v-slot:append>
          <v-chip size="small" :color="home.color.header" prepend-icon="mdi-note-plus-outline"
            >오늘 {{ dashboard.post.values.at(-1) || 0 }}개</v-chip
          >
        </template>
        <v-divider></v-divider>
        <v-sheet class="mx-auto" color="blue-grey-lighten-3">
          <v-sparkline
            :model-value="dashboard.post.values"
            color="white"
            :line-width="3"
            :padding="16"
            smooth
            :height="150"
            stroke-linecap="round"
            auto-draw
          ></v-sparkline>
        </v-sheet>
        <v-card-actions class="pa-0 ml-3 mr-3">
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-note-plus-outline" size="small"
            >어제 {{ dashboard.post.values.at(-2) || 0 }}개</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2" size="small" prepend-icon="mdi-note-multiple-outline"
            >총합 {{ util.num(dashboard.post.total) }}개</v-chip
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <v-row no-gutters>
    <v-col class="pa-1">
      <v-card class="mt-3 title">
        <template v-slot:title>댓글</template>
        <template v-slot:append>
          <v-chip size="small" :color="home.color.header" prepend-icon="mdi-chat-plus-outline"
            >오늘 {{ dashboard.reply.values.at(-1) || 0 }}개</v-chip
          >
        </template>
        <v-divider></v-divider>
        <v-sheet class="mx-auto" color="blue-grey-lighten-3">
          <v-sparkline
            :model-value="dashboard.reply.values"
            color="white"
            :line-width="3"
            :padding="16"
            smooth
            :height="150"
            stroke-linecap="round"
            auto-draw
          ></v-sparkline>
        </v-sheet>
        <v-card-actions class="pa-0 ml-3 mr-3">
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-chat-plus-outline" size="small"
            >어제 {{ dashboard.reply.values.at(-2) || 0 }} 개</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2" size="small" prepend-icon="mdi-chat"
            >총합 {{ util.num(dashboard.reply.total) }} 개</v-chip
          >
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col class="pa-1">
      <v-card class="mt-3 title">
        <template v-slot:title>첨부파일</template>
        <template v-slot:append>
          <v-chip size="small" :color="home.color.header" prepend-icon="mdi-file-plus-outline"
            >오늘 {{ dashboard.file.values.at(-1) || 0 }}개</v-chip
          >
        </template>
        <v-divider></v-divider>
        <v-sheet class="mx-auto" color="blue-grey-lighten-3">
          <v-sparkline
            :model-value="dashboard.file.values"
            color="white"
            :line-width="3"
            :padding="16"
            smooth
            :height="150"
            stroke-linecap="round"
            auto-draw
          ></v-sparkline>
        </v-sheet>
        <v-card-actions class="pa-0 ml-3 mr-3">
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-file-plus-outline" size="small"
            >어제 {{ dashboard.file.values.at(-2) || 0 }} 개</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2" size="small" prepend-icon="mdi-file-multiple-outline"
            >총합 {{ util.num(dashboard.file.total) }} 개</v-chip
          >
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col class="pa-1">
      <v-card class="mt-3 title">
        <template v-slot:title>본문 내 이미지</template>
        <template v-slot:append>
          <v-chip size="small" :color="home.color.header" prepend-icon="mdi-image-plus-outline"
            >오늘 {{ dashboard.image.values.at(-1) || 0 }}개</v-chip
          >
        </template>
        <v-divider></v-divider>
        <v-sheet class="mx-auto" color="blue-grey-lighten-3">
          <v-sparkline
            :model-value="dashboard.image.values"
            color="white"
            :line-width="3"
            :padding="16"
            smooth
            :height="150"
            stroke-linecap="round"
            auto-draw
          ></v-sparkline>
        </v-sheet>
        <v-card-actions class="pa-0 ml-3 mr-3">
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-image-plus-outline" size="small"
            >어제 {{ dashboard.image.values.at(-2) || 0 }} 개</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2" size="small" prepend-icon="mdi-image-multiple-outline"
            >총합 {{ util.num(dashboard.image.total) }} 개</v-chip
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useAdminDashboardStore } from "../../../store/admin/dashboard/general"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"

const dashboard = useAdminDashboardStore()
const util = useUtilStore()
const home = useHomeStore()
</script>

<style scoped>
.title {
  border-top: #607d8b 2px solid;
}
</style>
