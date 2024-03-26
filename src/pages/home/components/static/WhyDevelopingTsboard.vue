<template>
  <v-card rounded="xl" class="box">
    <v-card-title class="title"><v-icon class="mr-2">mdi-pin</v-icon> 왜 개발했나요?</v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pa-0 list">
      <v-list>
        <v-list-item prepend-icon="mdi-thumb-up-outline">
          타입스크립트 언어가 마음에 들었습니다!
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-head-question-outline">
          Bun과 ElysiaJS 조합으로 어느 정도 퍼포먼스를 낼 수 있을지 궁금하기도 했구요!</v-list-item
        >
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-account-group">
          Vue & Vuetify 기반 게시판을 만들면 재밌겠다 싶어서 시작했습니다!</v-list-item
        >
      </v-list>
    </v-card-text>
  </v-card>
</template>
