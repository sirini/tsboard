/**
 * store/comment
 *
 * 게시판, 갤러리의 댓글 상태 및 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { useAuthStore } from "../user/auth"
import { useUtilStore } from "../util"
import { Comment } from "../../interface/board"
import { COMMENT } from "../../messages/store/board/comment"

export const useCommentStore = defineStore("comment", () => {
  const server = edenTreaty<App>(process.env.API!)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const id = ref<string>("")
  const boardUid = ref<number>(0)
  const postUid = ref<number>(0)
  const modifyTarget = ref<number>(0)
  const replyTarget = ref<number>(0)
  const removeTarget = ref<number>(0)
  const content = ref<string>("")
  const contentWithSyntax = ref<string>("")
  const button = ref<string>(COMMENT.BUTTON_NEW)
  const confirmRemoveCommentDialog = ref<boolean>(false)
  const comments = ref<Comment[]>([])
  const page = ref<number>(1)
  const pageLength = ref<number>(1)
  const bunch = ref<number>(100)

  // 기존 댓글 불러오기
  async function loadCommentList(): Promise<void> {
    id.value = route.params.id as string
    postUid.value = parseInt(route.params.no as string)

    const response = await server.api.board.comment.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: id.value,
        postUid: postUid.value,
        page: page.value,
        bunch: bunch.value,
      },
    })

    if (!response.data) {
      util.snack(COMMENT.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.snack(`${COMMENT.FAILED_LOAD_COMMENT} (${response.data.error})`)
    }
    boardUid.value = response.data.result.boardUid
    comments.value = response.data.result.comments
    pageLength.value = Math.ceil(response.data.result.maxCommentUid / bunch.value)
  }

  // 댓글에 답글달기 시 대상 지정
  function setReplyComment(uid: number, comment: string, html: boolean = true): void {
    replyTarget.value = uid
    if (html) {
      content.value = `<blockquote>${comment}</blockquote><p>&nbsp;</p>`
    } else {
      content.value = comment
    }
    button.value = COMMENT.BUTTON_REPLY
    util.snack(COMMENT.INFO_REPLY)
  }

  // 댓글 수정하기 클릭 시 대상 지정
  function setModifyComment(uid: number, comment: string): void {
    modifyTarget.value = uid
    content.value = comment
    button.value = COMMENT.BUTTON_MODIFY
    util.snack(COMMENT.SET_MODIFY_TARGET)
  }

  // 댓글 작성 모드를 새 댓글로 초기화 (답글, 수정 취소)
  function resetCommentMode(): void {
    replyTarget.value = 0
    modifyTarget.value = 0
    button.value = COMMENT.BUTTON_NEW
    content.value = ""
    util.snack(COMMENT.RESET_COMMENT_MODE)
  }

  // 댓글에 좋아요 추가 (혹은 취소) 하기
  async function like(commentUid: number, isLike: boolean): Promise<void> {
    const response = await server.api.board.likecomment.patch({
      $headers: {
        authorization: auth.user.token,
      },
      boardUid: boardUid.value,
      commentUid,
      liked: isLike ? 1 : 0,
    })

    if (response.data && response.data.success === true) {
      comments.value.map((comment) => {
        if (comment.uid === commentUid) {
          comment.liked = isLike
          if (isLike) {
            comment.like += 1
          } else {
            comment.like -= 1
          }
        }
      })
    }
  }

  // 문법 강조까지 모두 포함된 글 내용 업데이트하기
  function updateRealHtml(html: string): void {
    contentWithSyntax.value = html
  }

  // 댓글 작성하기
  async function save(): Promise<void> {
    if (content.value.length < 2) {
      util.snack(COMMENT.TOO_SHORT_COMMENT)
      return
    }
    if (auth.user.uid < 1) {
      util.snack(COMMENT.NEED_LOGIN)
      return
    }

    if (replyTarget.value > 0) {
      await saveReplyComment()
      replyTarget.value = 0
    } else if (modifyTarget.value > 0) {
      await modifyComment()
      modifyTarget.value = 0
    } else {
      await saveNewComment()
    }
    content.value = ""
    contentWithSyntax.value = ""
  }

  // 새 댓글 작성하기
  async function saveNewComment(): Promise<void> {
    const response = await server.api.board.newcomment.post({
      $headers: {
        authorization: auth.user.token,
      },
      boardUid: boardUid.value,
      postUid: postUid.value,
      content: contentWithSyntax.value,
    })
    if (!response.data) {
      util.snack(COMMENT.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.snack(`${COMMENT.FAILED_SAVE_COMMENT} (${response.data.error})`)
      return
    }

    auth.updateUserToken(response.data.result.newAccessToken!)
    const newUid = response.data.result.newCommentUid
    comments.value.push({
      uid: newUid,
      writer: {
        uid: auth.user.uid,
        name: auth.user.name,
        profile: auth.user.profile,
      },
      content: content.value,
      like: 0,
      liked: false,
      submitted: Date.now(),
      modified: 0,
      status: 0,
      replyUid: newUid,
      postUid: postUid.value,
    })
    util.snack(COMMENT.SAVED_NEW_COMMENT)
  }

  // 답글 작성하기
  async function saveReplyComment(): Promise<void> {
    const response = await server.api.board.replycomment.post({
      $headers: {
        authorization: auth.user.token,
      },
      replyTargetUid: replyTarget.value,
      boardUid: boardUid.value,
      postUid: postUid.value,
      content: contentWithSyntax.value,
    })
    if (!response.data) {
      util.snack(COMMENT.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.snack(`${COMMENT.FAILED_SAVE_COMMENT} (${response.data.error})`)
      return
    }

    auth.updateUserToken(response.data.result.newAccessToken)
    const newUid = response.data.result.newCommentUid
    let targetIndex = 0
    comments.value.map((comment, index) => {
      if (comment.uid === replyTarget.value) {
        targetIndex = index
        return
      }
    })
    comments.value.splice(targetIndex + 1, 0, {
      uid: newUid,
      writer: {
        uid: auth.user.uid,
        name: auth.user.name,
        profile: auth.user.profile,
      },
      content: content.value,
      like: 0,
      liked: false,
      submitted: Date.now(),
      modified: 0,
      status: 0,
      replyUid: replyTarget.value,
      postUid: postUid.value,
    })
    util.snack(COMMENT.REPLIED_NEW_COMMENT)
  }

  // 기존 댓글 수정하기
  async function modifyComment(): Promise<void> {
    // do something
    util.snack(COMMENT.MODIFIED_COMMENT)
  }

  // 댓글 삭제 확인용 다이얼로그 열기
  function openRemoveCommentDialog(uid: number): void {
    removeTarget.value = uid
    confirmRemoveCommentDialog.value = true
  }

  // 댓글 삭제 확인용 다이얼로그 닫그
  function closeRemoveCommentDialog(): void {
    removeTarget.value = 0
    confirmRemoveCommentDialog.value = false
  }

  // 댓글 삭제하기
  async function removeComment(): Promise<void> {
    if (removeTarget.value < 1) {
      util.snack(COMMENT.INVALID_REMOVE_TARGET)
      return
    }
    // do something with removeTarget
    comments.value = comments.value.filter((comment: Comment) => {
      return removeTarget.value !== comment.uid
    })
    util.snack(COMMENT.REMOVED_COMMENT)
    closeRemoveCommentDialog()
  }

  return {
    id,
    modifyTarget,
    replyTarget,
    removeTarget,
    content,
    button,
    confirmRemoveCommentDialog,
    comments,
    page,
    pageLength,
    bunch,
    setReplyComment,
    setModifyComment,
    resetCommentMode,
    like,
    save,
    updateRealHtml,
    openRemoveCommentDialog,
    closeRemoveCommentDialog,
    removeComment,
    loadCommentList,
  }
})
