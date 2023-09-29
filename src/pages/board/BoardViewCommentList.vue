<template>
  <v-toolbar density="compact" class="pl-3 mt-4 comment_menu">
    <board-user-nametag></board-user-nametag>
    <v-spacer></v-spacer>
    <v-chip prepend-icon="mdi-heart"> 3</v-chip>
    <v-btn icon><v-icon size="small">mdi-reply</v-icon></v-btn>
    <v-btn icon><v-icon size="small">mdi-pencil-outline</v-icon></v-btn>
    <v-btn icon><v-icon size="small">mdi-trash-can</v-icon></v-btn>
  </v-toolbar>
  <v-card elevation="0" rounded="0" class="pa-5 comment"> 여기는 댓글 내용입니다. </v-card>
</template>

<script setup lang="ts">
import BoardUserNametag from "./BoardUserNametag.vue"
</script>

<style scoped>
.comment_menu {
  border: 1px #dddddd solid;
}
.comment {
  line-height: 1.8em;
}
</style>
