<template>
  <v-list-item class="pa-0 mt-4 ml-4 mr-4" v-for="(reply, index) in viewer.comments">
    <gallery-viewer-comment
      :commentUid="reply.uid"
      :commentContent="reply.content"
      :commentLike="reply.like"
      :writerProfile="reply.writer.profile"
      :writerUid="reply.writer.uid"
      :writerName="reply.writer.name"
      :liked="reply.liked"
    ></gallery-viewer-comment>
  </v-list-item>

  <v-list-item class="pa-0 mt-4 ml-4 mr-4">
    <v-textarea
      v-model="comment.content"
      variant="outlined"
      auto-grow
      hide-details
      :placeholder="TEXT[home.lang].LEAVE_COMMENT"
    ></v-textarea>
  </v-list-item>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../../store/board/gallery.viewer"
import { useCommentStore } from "../../../../store/board/comment"
import { useHomeStore } from "../../../../store/home"
import { TEXT } from "../../../../messages/components/gallery/viewer/gallery-viewer"
import GalleryViewerComment from "../GalleryViewerComment.vue"

const viewer = useViewerStore()
const comment = useCommentStore()
const home = useHomeStore()
</script>
