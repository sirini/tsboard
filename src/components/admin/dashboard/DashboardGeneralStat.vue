<template>
  <v-row>
    <v-col>
      <v-card class="mt-3 mb-3 ml-1">
        <v-card-title>방문자수</v-card-title>
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
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-finance"
            >어제 {{ dashboard.visit.yesterday }}명</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2">총 {{ dashboard.visit.total }}명</v-chip>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col>
      <v-card class="mt-3 mb-3">
        <v-card-title>회원 수</v-card-title>
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
            @click="util.go('adminMember')"
            >회원 관리 페이지
            <v-tooltip activator="parent">
              클릭하시면 TSBOARD 회원 관리 페이지로 이동합니다
            </v-tooltip>
          </v-btn>
        </v-sheet>
        <v-card-actions class="pa-0 ml-3 mr-3">
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-finance"
            >어제 {{ dashboard.member.yesterday }}명</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-finance"
            >오늘 {{ dashboard.member.today }}명</v-chip
          >
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col>
      <v-card class="mt-3 mb-3 mr-1">
        <v-card-title>게시글 수</v-card-title>
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
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-finance"
            >어제 {{ dashboard.post.yesterday }}개</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2">총 {{ dashboard.post.total }}개</v-chip>
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
