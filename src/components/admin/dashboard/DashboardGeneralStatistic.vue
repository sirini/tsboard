<template>
  <v-row no-gutters>
    <v-col class="pa-1">
      <v-card class="mt-3 mb-3">
        <v-card-title class="title">방문자수</v-card-title>
        <v-divider></v-divider>
        <v-sheet class="text-center pa-3"
          ><h1>{{ dashboard.visit.today }} 명</h1>
          <v-btn
            prepend-icon="mdi-calendar"
            variant="text"
            color="blue-grey-lighten-2"
            class="mt-2 mb-2"
            rounded="xl"
            >오늘 ({{ today.year }}/{{ today.month }}/{{ today.date }})</v-btn
          >
        </v-sheet>
        <v-card-actions class="pa-0 ml-3 mr-3">
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-finance" size="small"
            >어제 {{ dashboard.visit.yesterday }}명</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2" size="small" prepend-icon="mdi-finance"
            >그제 {{ dashboard.visit.total }}명</v-chip
          >
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col class="pa-1">
      <v-card class="mt-3 mb-3">
        <v-card-title class="title">회원 수</v-card-title>
        <v-divider></v-divider>
        <v-sheet class="text-center pa-3"
          ><h1>총 {{ dashboard.member.total }} 명</h1>
          <v-btn
            prepend-icon="mdi-cog-outline"
            color="blue-grey-lighten-2"
            elevation="0"
            variant="text"
            rounded="xl"
            class="mt-2 mb-2"
            @click="util.go('adminUser')"
            >회원 관리 페이지
            <v-tooltip activator="parent">
              클릭하시면 TSBOARD 회원 관리 페이지로 이동합니다
            </v-tooltip>
          </v-btn>
        </v-sheet>
        <v-card-actions class="pa-0 ml-3 mr-3">
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-finance" size="small"
            >어제 {{ dashboard.member.yesterday }}명</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-finance" size="small"
            >오늘 {{ dashboard.member.today }}명</v-chip
          >
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col class="pa-1">
      <v-card class="mt-3 mb-3">
        <v-card-title class="title">게시글</v-card-title>
        <v-divider></v-divider>
        <v-sheet class="text-center pa-3"
          ><h1>{{ dashboard.post.today }} 개</h1>
          <v-btn
            prepend-icon="mdi-calendar"
            variant="text"
            color="blue-grey-lighten-2"
            class="mt-2 mb-2"
            rounded="xl"
            >오늘 ({{ today.year }}/{{ today.month }}/{{ today.date }})</v-btn
          >
        </v-sheet>
        <v-card-actions class="pa-0 ml-3 mr-3">
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-finance" size="small"
            >어제 {{ dashboard.post.yesterday }}개</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2" size="small">총 {{ dashboard.post.total }}개</v-chip>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <v-row no-gutters>
    <v-col class="pa-1">
      <v-card class="mt-3 mb-3">
        <v-card-title class="title">댓글</v-card-title>
        <v-divider></v-divider>
        <v-sheet class="text-center pa-3">
          <h1>{{ dashboard.reply.today }} 개</h1>
          <v-btn
            prepend-icon="mdi-calendar"
            variant="text"
            color="blue-grey-lighten-2"
            class="mt-2 mb-2"
            rounded="xl"
          >
            오늘 ({{ today.year }}/{{ today.month }}/{{ today.date }})
          </v-btn>
        </v-sheet>
        <v-card-actions class="pa-0 ml-3 mr-3">
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-finance" size="small"
            >어제 {{ dashboard.reply.yesterday }} 개</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2" size="small"
            >총 {{ dashboard.reply.total }} 개</v-chip
          >
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col class="pa-1">
      <v-card class="mt-3 mb-3">
        <v-card-title class="title">첨부파일</v-card-title>
        <v-divider></v-divider>
        <v-sheet class="text-center pa-3">
          <h1>{{ dashboard.file.today }} 개</h1>
          <v-btn
            prepend-icon="mdi-calendar"
            variant="text"
            color="blue-grey-lighten-2"
            class="mt-2 mb-2"
            rounded="xl"
          >
            오늘 ({{ today.year }}/{{ today.month }}/{{ today.date }})
          </v-btn>
        </v-sheet>
        <v-card-actions class="pa-0 ml-3 mr-3">
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-finance" size="small"
            >어제 {{ dashboard.file.yesterday }} 개</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2" size="small">총 {{ dashboard.file.total }} 개</v-chip>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col class="pa-1">
      <v-card class="mt-3 mb-3">
        <v-card-title class="title">본문 이미지 파일</v-card-title>
        <v-divider></v-divider>
        <v-sheet class="text-center pa-3">
          <h1>{{ dashboard.image.today }} 개</h1>
          <v-btn
            prepend-icon="mdi-calendar"
            variant="text"
            color="blue-grey-lighten-2"
            class="mt-2 mb-2"
            rounded="xl"
          >
            오늘 ({{ today.year }}/{{ today.month }}/{{ today.date }})
          </v-btn>
        </v-sheet>
        <v-card-actions class="pa-0 ml-3 mr-3">
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-finance" size="small"
            >어제 {{ dashboard.image.yesterday }} 개</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2" size="small"
            >총 {{ dashboard.image.total }} 개</v-chip
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useAdminDashboardStore } from "../../../store/admin/dashboard/general"
import { useUtilStore } from "../../../store/util"

const dashboard = useAdminDashboardStore()
const util = useUtilStore()
const today = dashboard.today()
</script>

<style scoped>
.title {
  border-top: #607d8b 2px solid;
}
</style>
