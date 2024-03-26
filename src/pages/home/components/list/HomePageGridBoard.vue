<template>
  <v-card rounded="xl" class="box">
    <v-card-title class="title" @click="util.go('boardList', 'free')"
      ><v-icon class="mr-2">mdi-pin</v-icon> 자유게시판</v-card-title
    >
    <v-divider></v-divider>
    <v-card-text class="pa-0 list">
      <v-list>
        <v-list-item
          v-for="(post, index) in boardList"
          :key="index"
          @click="util.go('boardView', id, post.uid)"
        >
          <template v-slot:prepend>
            <v-chip size="small">{{ post.category }}</v-chip>
          </template>
          <v-list-item-title class="pl-2 pr-2">{{ post.title }}</v-list-item-title>
          <template v-slot:append>
            {{ util.date(post.submitted) }}
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useUtilStore } from "../../../../store/util"
import { useHomeStore } from "../../../../store/home"
import { LatestPost } from "../../../../interface/home"

const util = useUtilStore()
const home = useHomeStore()
const props = defineProps<{
  id: string
  limit: number
}>()
const boardList = ref<LatestPost[]>([])

onMounted(async () => {
  boardList.value = await home.getBoardLatest(props.id, props.limit)
})
</script>
