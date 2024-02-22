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
import { useCommentSaveStore } from "./comment/save"
import { Comment } from "../../interface/board"
import { COMMENT } from "../../messages/store/board/comment"
import { PAGING_DIRECTION } from "../../../server/database/board/const"

export const useCommentStore = defineStore("comment", () => {
  const server = edenTreaty<App>(process.env.API!)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const save = useCommentSaveStore()
  const id = ref<string>("")
  const boardUid = ref<number>(0)
  const postUid = ref<number>(0)
  const maxUid = ref<number>(0)
  const minUid = ref<number>(0)
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
  const pagingDirection = ref<number>(PAGING_DIRECTION.NEXT)
  const bunch = ref<number>(100)

  // 기존 댓글 불러오기
  // TODO
  // 이전 | 다음 처리 관련 추가하기
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
        pagingDirection: pagingDirection.value,
        bunch: bunch.value,
        maxUid: maxUid.value,
        minUid: minUid.value,
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
    pageLength.value = Math.ceil(response.data.result.totalCommentCount / bunch.value)
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

  // 새 댓글 추가하기
  async function saveNewComment(): Promise<void> {
    const comment = await save.newComment({
      boardUid: boardUid.value,
      postUid: postUid.value,
      content: contentWithSyntax.value,
    })
    if (comment.uid > 0) {
      comments.value.push(comment)
    }
  }

  // 기존 댓글 수정하기
  async function modifyExistComment(): Promise<void> {
    await save.modifyComment({
      modifyTargetUid: modifyTarget.value,
      boardUid: boardUid.value,
      postUid: postUid.value,
      content: contentWithSyntax.value,
    })
    comments.value.map((comment) => {
      if (comment.uid === modifyTarget.value) {
        comment.content = contentWithSyntax.value
        return
      }
    })
  }

  // 기존 댓글에 답글달기
  async function saveReplyComment(): Promise<void> {
    let targetIndex = 0
    const comment = await save.replyComment({
      replyTargetUid: replyTarget.value,
      boardUid: boardUid.value,
      postUid: postUid.value,
      content: contentWithSyntax.value,
    })
    if (comment.uid > 0) {
      comments.value.map((comment, index) => {
        if (comment.uid === replyTarget.value) {
          targetIndex = index
          return
        }
      })
      comments.value.splice(targetIndex + 1, 0, comment)
    }
  }

  // 댓글 작성하기
  async function saveComment(): Promise<void> {
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
    } else if (modifyTarget.value > 0) {
      await modifyExistComment()
    } else {
      await saveNewComment()
    }
    content.value = ""
    contentWithSyntax.value = ""
    replyTarget.value = 0
    modifyTarget.value = 0
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

  // 댓글 삭제하기, 답글이 달려려있는 댓글은 내용만 제거됨 (isChangeStatus = false)
  async function removeComment(): Promise<void> {
    if (removeTarget.value < 1) {
      util.snack(COMMENT.INVALID_REMOVE_TARGET)
      return
    }
    const response = await server.api.board.removecomment.delete({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        boardUid: boardUid.value,
        removeTargetUid: removeTarget.value,
      },
    })
    if (!response.data) {
      util.snack(COMMENT.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.snack(`${COMMENT.FAILED_REMOVE_COMMENT} (${response.data.error})`)
      return
    }
    if (response.data.result.isChangeStatus === true) {
      comments.value = comments.value.filter((comment) => {
        return removeTarget.value !== comment.uid
      })
    } else {
      comments.value.map((comment) => {
        if (removeTarget.value === comment.uid) {
          comment.content = COMMENT.NOTE_REMOVED_COMMENT
          return
        }
      })
    }

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
    saveComment,
    updateRealHtml,
    openRemoveCommentDialog,
    closeRemoveCommentDialog,
    removeComment,
    loadCommentList,
  }
})
