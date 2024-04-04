<template>
  <v-card rounded="xl" class="box" :color="home.color.header">
    <v-card-title class="post-title"
      ><v-icon class="mr-2">mdi-pin</v-icon>
      <strong>{{ TEXT[home.lang].TITLE }}</strong></v-card-title
    >
    <v-divider></v-divider>
    <v-card-text class="pa-0 post-content">
      <v-list class="pa-0" :bg-color="home.color.header">
        <v-list-item prepend-icon="mdi-language-typescript"
          >{{ TEXT[home.lang].SUMMARY }}
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-vuejs">{{ TEXT[home.lang].FRONT }}</v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-database-sync-outline">
          {{ TEXT[home.lang].BACK }}
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn
        block
        rounded="xl"
        prepend-icon="mdi-github"
        append-icon="mdi-chevron-right"
        @click="util.open('https://github.com/sirini/tsboard')"
        >{{ TEXT[home.lang].GITHUB }}
        <v-tooltip activator="parent">{{ TEXT[home.lang].GITHUB_TOOLTIP }}</v-tooltip>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../../../store/home"
import { useUtilStore } from "../../../../store/util"
import { TEXT } from "../../../../messages/pages/home/components/static/what-is-tsboard"

const home = useHomeStore()
const util = useUtilStore()
</script>

<style scoped>
.post-title {
  font-size: 1em;
}
.post-content {
  line-height: 1.8em;
  height: 199px;
  overflow: hidden;
}
</style>
