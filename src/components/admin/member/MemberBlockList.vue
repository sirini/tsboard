<template>
  <v-card elevation="0">
    <v-list>
      <v-list-subheader>차단된 회원 검색</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item>
        <v-row>
          <v-col cols="5">
            <v-btn-toggle v-model="block.option" mandatory class="mt-1">
              <v-btn size="large" value="name">이름</v-btn>
              <v-btn size="large" value="id">아이디</v-btn>
              <v-btn size="large" value="level">레벨</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              v-model="block.search"
              hide-details
              density="compact"
              class="mt-2"
              prepend-inner-icon="mdi-account-question-outline"
              append-inner-icon="mdi-magnify"
              @click:append-inner=""
            ></v-text-field>
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-subheader>차단된 회원 목록</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item
        density="compact"
        v-for="(member, index) in block.members"
        :key="index"
        :prepend-avatar="member.profile"
      >
        <v-row>
          <v-col cols="2" class="text-center">{{ member.name }}</v-col>
          <v-col cols="3" class="text-center text-caption">{{ member.id }}</v-col>
          <v-col cols="2" class="text-center">{{ member.point }} <span class="info">P</span></v-col>
          <v-col cols="2" class="text-center"
            ><span class="info">Lv.</span> {{ member.level }}</v-col
          >
          <v-col cols="3" class="text-center text-caption">{{ member.signupDate }}</v-col>
        </v-row>
        <template v-slot:append>
          <v-btn elevation="0" icon @click="block.unblock({ uid: member.uid, name: member.name })">
            <v-icon>mdi-account-arrow-up</v-icon>
            <v-tooltip activator="parent">
              클릭하시면 {{ member.name }}님의 차단을 해제합니다.
            </v-tooltip>
          </v-btn>
        </template>
      </v-list-item>
      <v-divider></v-divider>
    </v-list>
    <v-pagination v-model="block.paging" :length="5" class="mb-3"></v-pagination>
  </v-card>
</template>

<script setup lang="ts">
import { useAdminMemberBlockStore } from "../../../store/admin/member/block"

const block = useAdminMemberBlockStore()
</script>

<style scoped>
.info {
  color: #cfd8dc;
}
</style>
