<template>
  <v-card rounded="xl" class="box">
    <v-card-title class="title"
      ><v-icon class="mr-2">mdi-pin</v-icon> TSBOARD는 무엇인가요?</v-card-title
    >
    <v-divider></v-divider>
    <v-card-text class="pa-0 list">
      <v-list>
        <v-list-item prepend-icon="mdi-language-typescript">
          TSBOARD는 <strong>타입스크립트</strong>로 작성된 오픈소스 게시판입니다.
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-vuejs">
          프론트엔드는 Vue 3 / Vuetify / Vue Router / Pinia / Tiptap 으로 구성되어 있습니다.
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-database-sync-outline">
          백엔드는 Bun / ElysiaJS / MySQL(MariaDB) 로 구성됩니다.
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
