<template>
  <v-card elevation="0">
    <v-list>
      <v-list-subheader>회원 검색</v-list-subheader>
      <v-list-item>
        <v-row>
          <v-col cols="4">
            <v-btn-toggle v-model="general.option" mandatory class="mt-1">
              <v-btn size="large">이름</v-btn>
              <v-btn size="large">아이디</v-btn>
              <v-btn size="large">레벨</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              v-model="general.search"
              hide-details
              prepend-inner-icon="mdi-account-question-outline"
              append-inner-icon="mdi-magnify"
              @click:append-inner=""
            ></v-text-field>
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-subheader>회원 목록</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item
        density="compact"
        v-for="(member, index) in general.members"
        :key="index"
        :prepend-avatar="member.profile"
      >
        <v-row>
          <v-col cols="2" class="text-center">{{ member.name }}</v-col>
          <v-col cols="4" class="text-center">{{ member.id }}</v-col>
          <v-col cols="2" class="text-center"
            >{{ member.point }} <span class="info">points</span></v-col
          >
          <v-col cols="2" class="text-center"
            ><span class="info">Lv.</span> {{ member.level }}</v-col
          >
          <v-col cols="2" class="text-center">{{ member.signupDate }}</v-col>
        </v-row>
        <template v-slot:append>
          <v-btn elevation="0" icon @click="util.go('adminMemberManager', member.uid.toString())">
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent">
              클릭하시면 {{ member.name }}님의 정보를 수정하러 이동합니다.
            </v-tooltip>
          </v-btn>
        </template>
      </v-list-item>
      <v-divider></v-divider>
    </v-list>
    <v-pagination v-model="general.paging" :length="5" class="mb-3"></v-pagination>
  </v-card>
</template>

<script setup lang="ts">
import { useUtilStore } from "../../../store/util"
import { useAdminMemberGeneralStore } from "../../../store/admin/member/general"

const util = useUtilStore()
const general = useAdminMemberGeneralStore()
const PREFIX = process.env.PREFIX || ""
</script>

<style scoped>
.info {
  color: #cfd8dc;
}
</style>
