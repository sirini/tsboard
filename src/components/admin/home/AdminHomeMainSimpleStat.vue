<template>
  <v-row>
    <v-col>
      <v-card class="mt-3 mb-3 ml-1">
        <v-card-title>방문자수</v-card-title>
        <v-divider></v-divider>
        <v-sheet class="text-center pa-3"
          ><h1>{{ main.visit.today }} 명</h1>
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
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-plus"
            >어제 {{ main.visit.yesterday }}명</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2">총 {{ main.visit.total }}명</v-chip>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mt-3 mb-3">
        <v-card-title>회원 수</v-card-title>
        <v-divider></v-divider>
        <v-sheet class="text-center pa-3"
          ><h1>총 {{ main.member.total }} 명</h1>
          <v-btn
            prepend-icon="mdi-cog-outline"
            color="blue-grey-lighten-2"
            elevation="0"
            variant="text"
            rounded="xl"
            class="mt-2 mb-2"
            >회원 관리 페이지
            <v-tooltip activator="parent">
              클릭하시면 TSBOARD 회원 관리 페이지로 이동합니다
            </v-tooltip>
          </v-btn>
        </v-sheet>
        <v-card-actions class="pa-0 ml-3 mr-3">
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-plus"
            >어제 {{ main.member.yesterday }}명</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-plus"
            >오늘 {{ main.member.today }}명</v-chip
          >
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mt-3 mb-3 mr-1">
        <v-card-title>게시글 수</v-card-title>
        <v-divider></v-divider>
        <v-sheet class="text-center pa-3"
          ><h1>{{ main.post.today }} 개</h1>
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
          <v-chip color="blue-grey-lighten-2" prepend-icon="mdi-plus"
            >어제 {{ main.post.yesterday }}개</v-chip
          >
          <v-spacer></v-spacer>
          <v-chip color="blue-grey-lighten-2">총 {{ main.post.total }}개</v-chip>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useAdminHomeMainStore } from "../../../store/admin/home/main"

const main = useAdminHomeMainStore()
const today = main.today()
</script>
