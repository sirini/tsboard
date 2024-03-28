<template>
  <v-list>
    <v-list-item
      class="pb-2"
      :prepend-avatar="
        TSBOARD.PREFIX +
        (viewer.post.writer.profile.length > 0 ? viewer.post.writer.profile : '/no-profile.svg')
      "
      :title="util.unescape(viewer.post.title)"
      :subtitle="util.unescape(viewer.post.writer.name)"
    >
      <template v-slot:append>
        <v-btn icon @click="viewer.close" elevation="0"
          ><v-icon>mdi-close</v-icon>
          <v-tooltip activator="parent" location="top"> 클릭하시면 이 창을 닫습니다 </v-tooltip>
        </v-btn>
      </template>
    </v-list-item>
    <v-divider></v-divider>

    <v-list-item class="pt-2 pb-2">
      <v-card elevation="0" rounded="0">
        <v-card-text class="pa-0 pt-2 tsboard" v-html="viewer.post.content"></v-card-text>
      </v-card>
    </v-list-item>

    <v-list-item class="pt-2 pb-2">
      <v-row no-gutters>
        <v-col v-for="(thumb, index) in viewer.thumbnails" :key="index" cols="2">
          <v-img
            cover
            height="80"
            :src="TSBOARD.PREFIX + thumb"
            :class="viewer.position === index ? 'selected' : 'deselected'"
            @click="viewer.position = index"
          ></v-img>
        </v-col>
      </v-row>
    </v-list-item>

    <v-list-item class="pt-2 pb-2">
      <v-chip
        label
        prepend-icon="mdi-tag-outline"
        class="mr-2 mb-2"
        v-for="(tag, index) in viewer.tags"
        :key="index"
        >{{ tag.name }}</v-chip
      >
    </v-list-item>

    <v-list-item class="pt-2 pb-2 info">
      <v-icon class="mr-2">mdi-calendar</v-icon>
      <span class="submitted">{{ util.date(viewer.post.submitted) }}</span>
      <span v-if="viewer.post.modified > 0" class="modified pl-2 ml-2 mr-2">{{
        util.date(viewer.post.modified)
      }}</span>
      <v-icon class="ml-4 mr-2">mdi-eye-outline</v-icon> {{ util.num(viewer.post.hit) }}

      <template v-slot:append>
        <user-nametag
          :uid="viewer.post.writer.uid"
          :name="viewer.post.writer.name"
          :profile="viewer.post.writer.profile"
          size="small"
        ></user-nametag>
      </template>
    </v-list-item>

    <gallery-viewer-toolbar
      :postLike="viewer.post.like"
      :postUid="viewer.post.uid"
      :writerUid="viewer.post.writer.uid"
      :liked="viewer.post.liked"
    ></gallery-viewer-toolbar>

    <v-list-item class="pa-0 mt-2 ml-2 mr-2" v-for="(reply, index) in viewer.comments">
      <gallery-viewer-comment
        :commentUid="reply.uid"
        :commentContent="reply.content"
        :commentLike="reply.like"
        :writerProfile="
          TSBOARD.PREFIX +
          (reply.writer.profile.length > 0 ? reply.writer.profile : '/no-profile.svg')
        "
        :writerUid="reply.writer.uid"
        :writerName="reply.writer.name"
        :liked="reply.liked"
      ></gallery-viewer-comment>
    </v-list-item>

    <v-list-item class="pa-0 mt-2 ml-2 mr-2">
      <v-textarea
        v-model="comment.content"
        variant="outlined"
        auto-grow
        hide-details
        placeholder="사진이 마음에 드셨다면 댓글을 남겨주세요!"
      ></v-textarea>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../store/board/gallery/viewer"
import { useCommentStore } from "../../../store/board/comment"
import { useUtilStore } from "../../../store/util"
import { TSBOARD } from "../../../../tsboard.config"
import GalleryViewerToolbar from "./GalleryViewerToolbar.vue"
import GalleryViewerComment from "./GalleryViewerComment.vue"
import UserNametag from "../../user/UserNametag.vue"

const viewer = useViewerStore()
const comment = useCommentStore()
const util = useUtilStore()
</script>
