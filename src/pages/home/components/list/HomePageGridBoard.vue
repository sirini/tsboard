<template>
  <v-card rounded="xl" class="box" :color="home.color.header">
    <v-card-title class="post-title" @click="util.go('boardList', 'free')"
      ><v-icon class="mr-2">mdi-pin</v-icon> <strong>{{ board.name }}</strong></v-card-title
    >
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <v-list class="pa-0" :bg-color="home.color.header">
        <v-list-item
          v-for="(post, index) in board.latest"
          :key="index"
          @click="util.go('boardView', id, post.uid)"
        >
          <template v-slot:prepend>
            <v-chip size="small" color="blue-grey" v-if="post.useCategory">{{
              post.category
            }}</v-chip>

            <v-chip size="small" color="blue-grey" prepend-icon="mdi-heart-outline" v-else>{{
              util.num(post.like)
            }}</v-chip>
          </template>

          <v-list-item-title class="pl-2 pr-2 post-title"
            >{{ post.title }}
            <v-chip size="small" color="blue-grey" class="ml-2" v-if="post.comment > 0">{{
              util.num(post.comment)
            }}</v-chip></v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useUtilStore } from "../../../../store/util"
import { useHomeStore } from "../../../../store/home"
import { BoardLatest, LatestPost } from "../../../../interface/home"

const util = useUtilStore()
const home = useHomeStore()
const props = defineProps<{
  id: string
  limit: number
}>()
const board = ref<BoardLatest>({
  name: "",
  latest: [] as LatestPost[],
})

onMounted(async () => {
  board.value = await home.getBoardLatest(props.id, props.limit)
})
</script>

<style scoped>
.post-title {
  font-size: 1em;
}
</style>
