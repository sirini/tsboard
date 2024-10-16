<template>
  <v-card variant="plain">
    <v-tabs v-model="tab" align-tabs="center" density="compact">
      <v-tab :value="1"><v-icon>mdi-note-multiple</v-icon></v-tab>
      <v-tab :value="2"><v-icon>mdi-comment-multiple</v-icon></v-tab>
    </v-tabs>
    <v-divider></v-divider>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <v-list density="compact" class="pa-0">
          <v-list-item
            v-for="(post, index) in view.writerPosts"
            :key="index"
            @click="util.go(post.board.type, post.board.id, post.postUid)"
          >
            <template v-slot:prepend>
              <v-chip size="x-small" :color="home.color.header" label>{{
                util.unescape(post.board.name)
              }}</v-chip>
            </template>

            <v-list-item-title class="text-caption ml-2"
              >{{ util.unescape(post.title) }}
              <v-chip
                size="x-small"
                variant="text"
                :color="home.color.header"
                :prepend-icon="post.reply > 0 ? 'mdi-comment' : 'mdi-comment-outline'"
                >{{ post.reply }}</v-chip
              >
              <v-chip
                size="x-small"
                variant="text"
                :color="home.color.header"
                :prepend-icon="post.like > 0 ? 'mdi-heart' : 'mdi-heart-outline'"
                >{{ post.like }}</v-chip
              >
            </v-list-item-title>

            <template v-slot:append>
              <span class="text-caption">{{ util.date(post.submitted) }}</span>
            </template>
          </v-list-item>
        </v-list>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <v-list density="compact" class="pa-0">
          <v-list-item
            v-for="(comment, index) in view.writerComments"
            :key="index"
            @click="util.go(comment.board.type, comment.board.id, comment.postUid)"
          >
            <template v-slot:prepend>
              <v-chip size="x-small" :color="home.color.header" label>{{
                util.unescape(comment.board.name)
              }}</v-chip>
            </template>

            <v-list-item-title class="text-caption ml-2"
              >{{ util.unescape(comment.content) }}
              <v-chip
                size="x-small"
                variant="text"
                :color="home.color.header"
                :prepend-icon="comment.like > 0 ? 'mdi-heart' : 'mdi-heart-outline'"
                >{{ comment.like }}</v-chip
              >
            </v-list-item-title>

            <template v-slot:append>
              <span class="text-caption">{{ util.date(comment.submitted) }}</span>
            </template>
          </v-list-item>
        </v-list>
      </v-tabs-window-item>
    </v-tabs-window>
    <v-divider></v-divider>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useBoardViewStore } from "../../../store/board/view"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"

const view = useBoardViewStore()
const util = useUtilStore()
const home = useHomeStore()
const tab = ref<number>(0)
</script>
