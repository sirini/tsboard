/**
 * store/board/comment/save
 *
 * 댓글 추가, 수정, 답글 달기 관련 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../../server/index"
import { useUtilStore } from "../../util"
import { useAuthStore } from "../../user/auth"
import { useHomeStore } from "../../home"
import { TEXT } from "../../../messages/store/board/comment"
import { INIT_COMMENT } from "../../../../server/database/board/const"
import { Comment } from "../../../interface/board"
import { TSBOARD } from "../../../../tsboard.config"

type SaveNewCommentParams = {
  boardUid: number
  postUid: number
  content: string
}

type SaveReplyCommentParams = SaveNewCommentParams & {
  replyTargetUid: number
}

type SaveModifyCommentParams = SaveNewCommentParams & {
  modifyTargetUid: number
}

export const useCommentSaveStore = defineStore("commentSave", () => {
  const server = edenTreaty<App>(TSBOARD.API.URI)
  const util = useUtilStore()
  const auth = useAuthStore()
  const home = useHomeStore()
  const content = ref<string>("")

  // 새 댓글 작성하기
  async function newComment(param: SaveNewCommentParams): Promise<Comment> {
    let result: Comment = INIT_COMMENT
    const response = await server.api.board.newcomment.post({
      $headers: {
        authorization: auth.user.token,
      },
      boardUid: param.boardUid,
      postUid: param.postUid,
      content: param.content,
    })
    if (!response.data) {
      util.snack(TEXT[home.lang].NO_RESPONSE)
      return result
    }
    if (response.data.success === false) {
      util.snack(`${TEXT[home.lang].FAILED_SAVE_COMMENT} (${response.data.error})`)
      return result
    }

    auth.updateUserToken(response.data.result.newAccessToken)
    const newUid = response.data.result.newCommentUid
    result = {
      uid: newUid,
      writer: {
        uid: auth.user.uid,
        name: auth.user.name,
        profile: auth.user.profile,
      },
      content: param.content,
      like: 0,
      liked: false,
      submitted: Date.now(),
      modified: 0,
      status: 0,
      replyUid: newUid,
      postUid: param.postUid,
    }
    util.snack(TEXT[home.lang].SAVED_NEW_COMMENT)
    return result
  }

  // 답글 작성하기
  async function replyComment(param: SaveReplyCommentParams): Promise<Comment> {
    let result = INIT_COMMENT

    const response = await server.api.board.replycomment.post({
      $headers: {
        authorization: auth.user.token,
      },
      replyTargetUid: param.replyTargetUid,
      boardUid: param.boardUid,
      postUid: param.postUid,
      content: param.content,
    })
    if (!response.data) {
      util.snack(TEXT[home.lang].NO_RESPONSE)
      return result
    }
    if (response.data.success === false) {
      util.snack(`${TEXT[home.lang].FAILED_SAVE_COMMENT} (${response.data.error})`)
      return result
    }

    auth.updateUserToken(response.data.result.newAccessToken)
    const newUid = response.data.result.newCommentUid
    result = {
      uid: newUid,
      writer: {
        uid: auth.user.uid,
        name: auth.user.name,
        profile: auth.user.profile,
      },
      content: param.content,
      like: 0,
      liked: false,
      submitted: Date.now(),
      modified: 0,
      status: 0,
      replyUid: param.replyTargetUid,
      postUid: param.postUid,
    }
    util.snack(TEXT[home.lang].REPLIED_NEW_COMMENT)
    return result
  }

  // 기존 댓글 수정하기
  async function modifyComment(param: SaveModifyCommentParams): Promise<void> {
    const response = await server.api.board.modifycomment.patch({
      $headers: {
        authorization: auth.user.token,
      },
      modifyTargetUid: param.modifyTargetUid,
      boardUid: param.boardUid,
      postUid: param.postUid,
      content: param.content,
    })
    if (!response.data) {
      util.snack(TEXT[home.lang].NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.snack(`${TEXT[home.lang].FAILED_MODIFY_COMMENT} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    util.snack(TEXT[home.lang].MODIFIED_COMMENT)
  }

  return {
    newComment,
    replyComment,
    modifyComment,
  }
})
