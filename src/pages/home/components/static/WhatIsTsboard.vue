<template>
  <v-card rounded="xl" class="box">
    <v-card-title class="post-title"
      ><v-icon class="mr-2">mdi-pin</v-icon> TSBOARD는 무엇인가요?</v-card-title
    >
    <v-divider></v-divider>
    <v-card-text class="pa-0 list">
      <v-list class="pa-0">
        <v-list-item prepend-icon="mdi-language-typescript">
          TSBOARD는 <strong>타입스크립트</strong>로 작성된 커뮤니티 빌더입니다.
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-vuejs">
          프론트엔드는 Vue, Vuetify, Vue Router, Pinia 그리고 에디터 Tiptap으로 구성되어 있습니다.
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-database-sync-outline">
          백엔드는 Bun, ElysiaJS, MySQL로 구성되어 안정적이면서도 빠른 성능을 보여줍니다.
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          block
          size="large"
          prepend-icon="mdi-github"
          append-icon="mdi-chevron-right"
          @click="util.open('https://github.com/sirini/tsboard/blob/main/README.md')"
          color="blue-grey"
          >README 보러가기
          <v-tooltip activator="parent"
            >깃허브에서 TSBOARD README.md 문서를 확인합니다. 이곳에서 설치 방법, 주의사항 등을
            확인할 수 있습니다!</v-tooltip
          >
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useUtilStore } from "../../../../store/util"

const util = useUtilStore()
</script>

<style scoped>
.post-title {
  font-size: 1em;
  font-weight: bold;
}
</style>
