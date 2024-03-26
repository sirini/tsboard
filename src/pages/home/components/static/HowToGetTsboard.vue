<template>
  <v-card rounded="xl" class="box">
    <v-card-title class="title"><v-icon class="mr-2">mdi-pin</v-icon> 어디서 받나요?</v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pa-0 list">
      <v-list>
        <v-list-item
          >TSBOARD는 깃허브를 통해 소스코드 전체를 내려받으실 수 있으며, 사이트의 목적에 맞게
          수정하여 활용하실 수 있습니다.</v-list-item
        >
        <v-divider></v-divider>
        <v-list-item> 설치 안내는 Github 페이지에서 확인 하실 수 있습니다. </v-list-item>
      </v-list>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn
        block
        size="large"
        prepend-icon="mdi-download"
        append-icon="mdi-github"
        color="blue-grey"
        >Download from Github
        <v-tooltip activator="parent">TSBOARD 깃허브 페이지로 이동합니다!</v-tooltip>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
