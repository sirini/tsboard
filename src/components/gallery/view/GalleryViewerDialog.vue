<template>
  <v-dialog v-model="viewer.dialog" persistent>
    <v-card>
      <v-layout>
        <v-main>
          <v-img
            class="text-center"
            :src="PREFIX + viewer.photo.files?.at(viewer.position)"
            @mousedown="viewer.mouseDown"
            @mousemove="viewer.mouseMove"
            @mouseup="viewer.mouseUp"
            @mousewheel="viewer.mouseWheel"
            @mouseleave="viewer.mouseLeave"
            id="tsboardViewerPreview"
          >
          </v-img>
        </v-main>

        <v-navigation-drawer
          permanent
          nav
          :width="viewer.drawerWidth"
          :location="viewer.drawerPosition"
          color="grey-darken-4"
        >
          <v-list>
            <v-list-item class="pb-2">
              {{ viewer.photo?.subject }}
              <template v-slot:append>
                <v-btn icon @click="viewer.dialog = false" elevation="0" color="grey-darken-4"
                  ><v-icon>mdi-close</v-icon>
                  <v-tooltip activator="parent" location="top">
                    클릭하시면 이 창을 닫습니다
                  </v-tooltip>
                </v-btn>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="pt-2 pb-2">
              <v-card elevation="0" color="grey-darken-4">
                <v-card-text class="pa-0 pt-2 content">{{ viewer.photo?.content }}</v-card-text>
                <v-card-actions class="pa-0">
                  <v-chip
                    label
                    size="small"
                    variant="text"
                    color="grey"
                    prepend-icon="mdi-calendar"
                    >{{ util.date(viewer.photo.submitted) }}</v-chip
                  >
                  <v-chip label size="small" variant="text" color="grey" prepend-icon="mdi-eye">{{
                    viewer.photo.hit
                  }}</v-chip>
                  <v-spacer></v-spacer>
                  <user-nametag
                    :uid="viewer.photo.writer.uid"
                    :name="viewer.photo.writer.name"
                    :profile="viewer.photo.writer.profile"
                    size="small"
                  ></user-nametag>
                </v-card-actions>
              </v-card>
            </v-list-item>

            <gallery-viewer-toolbar
              :postLike="viewer.photo?.like || 0"
              :postUid="viewer.photo?.uid || 0"
              :writerUid="viewer.photo?.writer.uid || 0"
              :liked="viewer.photo?.liked || false"
            ></gallery-viewer-toolbar>

            <v-list-item class="pa-0 mt-2 ml-2 mr-2" v-for="i in 3" :key="i">
              <gallery-viewer-comment
                :commentUid="i"
                commentContent="댓글 내용"
                :commentLike="i"
                :writerProfile="PREFIX + '/no-profile.svg'"
                :writerUid="10"
                writerName="댓작성자"
                :liked="false"
              ></gallery-viewer-comment>
            </v-list-item>

            <v-list-item class="pa-0 mt-2 ml-2 mr-2">
              <v-textarea
                v-model="comment.content"
                variant="outlined"
                auto-grow
                :rules="viewer.textRule"
                placeholder="사진이 마음에 드셨다면 댓글을 남겨주세요!"
              ></v-textarea>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-btn
              v-show="comment.modifyTarget > 0 || comment.replyTarget > 0"
              prepend-icon="mdi-new-box"
              @click="comment.resetCommentMode"
            >
              새 댓글로 변경
              <v-tooltip activator="parent">
                작성중인 본문 내용을 모두 삭제하고, 새 댓글 작성 모드로 변경합니다. (답글달기,
                수정하기에서 새 댓글로 변경하고 싶을 때 클릭!)
              </v-tooltip>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="submit" append-icon="mdi-chevron-right">{{
              comment.button
            }}</v-btn>
          </v-card-actions>
        </v-navigation-drawer>
      </v-layout>
    </v-card>
  </v-dialog>
  <board-view-comment-remove-dialog @remove="removeComment"></board-view-comment-remove-dialog>
  <user-info-dialog></user-info-dialog>
  <send-note-dialog></send-note-dialog>
  <send-report-dialog></send-report-dialog>
  <manage-user-dialog></manage-user-dialog>
</template>

<script setup lang="ts">
import { watch } from "vue"
import { useCommentStore } from "../../../store/comment"
import { useViewerStore } from "../../../store/viewer"
import { useUtilStore } from "../../../store/util"
import GalleryViewerComment from "./GalleryViewerComment.vue"
import GalleryViewerToolbar from "./GalleryViewerToolbar.vue"
import UserNametag from "../../user/UserNametag.vue"
import UserInfoDialog from "../../user/UserInfoDialog.vue"
import SendNoteDialog from "../../user/SendNoteDialog.vue"
import SendReportDialog from "../../user/SendReportDialog.vue"
import ManageUserDialog from "../../user/ManageUserDialog.vue"
import BoardViewCommentRemoveDialog from "../../board/comment/BoardViewCommentRemoveDialog.vue"

const PREFIX = process.env.PREFIX || ""
const viewer = useViewerStore()
const util = useUtilStore()
const comment = useCommentStore()

// 뷰어 창이 열리면 사진들 가져오기
watch(
  () => viewer.dialog,
  (value: boolean) => {
    if (value) {
      viewer.load()
    }
  },
)

// 댓글 작성하기
async function submit(): Promise<void> {
  const text = comment.content.trim()
  if (text.length < 3) {
    util.snack("댓글은 3글자 이상 입력해 주세요")
    return
  }
  await viewer.save(text)
  comment.content = ""
}

// 댓글 삭제하기 처리
function removeComment(): void {
  // do something
  util.snack("댓글이 정상적으로 삭제(비공개) 되었습니다.")
}
</script>

<style scoped>
.content {
  font-size: 1em;
}
</style>
