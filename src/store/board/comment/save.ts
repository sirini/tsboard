import { defineStore } from "pinia"
import { ref } from "vue"
import { TSBOARD } from "../../../../tsboard.config"
import { TEXT } from "../../../messages/store/board/comment"
import { useHomeStore } from "../../home"
import { useAuthStore } from "../../user/auth"
import { useUtilStore } from "../../util"
import axios from "axios"
import {
  COMMENT_RESULT,
  CommentNewParameter,
  CommentResult,
  CommentTargetParameter,
} from "../../../interface/comment_interface"

export const useCommentSaveStore = defineStore("commentSave", () => {
  const util = useUtilStore()
  const auth = useAuthStore()
  const home = useHomeStore()
  const content = ref<string>("")

  // 새 댓글 작성하기
  async function newComment(param: CommentNewParameter): Promise<CommentResult> {
    let result: CommentResult = COMMENT_RESULT
    const response = await axios.post(
      `${TSBOARD.API}/comment/write`,
      {
        boardUid: param.boardUid,
        postUid: param.postUid,
        content: param.content,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      },
    )

    if (!response.data) {
      util.snack(TEXT[home.lang].NO_RESPONSE)
      return result
    }
    if (response.data.success === false) {
      util.snack(`${TEXT[home.lang].FAILED_SAVE_COMMENT} (${response.data.error})`)
      return result
    }

    result = {
      uid: response.data.result,
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
      replyUid: response.data.result,
      postUid: param.postUid,
    }
    util.snack(TEXT[home.lang].SAVED_NEW_COMMENT)
    return result
  }

  // 답글 작성하기
  async function replyComment(param: CommentTargetParameter): Promise<CommentResult> {
    let result: CommentResult = COMMENT_RESULT
    const response = await axios.post(
      `${TSBOARD.API}/comment/reply`,
      {
        replyTargetUid: param.targetUid,
        boardUid: param.boardUid,
        postUid: param.postUid,
        content: param.content,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      },
    )

    if (!response.data) {
      util.snack(TEXT[home.lang].NO_RESPONSE)
      return result
    }
    if (response.data.success === false) {
      util.snack(`${TEXT[home.lang].FAILED_SAVE_COMMENT} (${response.data.error})`)
      return result
    }

    result = {
      uid: response.data.result,
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
      replyUid: param.targetUid,
      postUid: param.postUid,
    }
    util.snack(TEXT[home.lang].REPLIED_NEW_COMMENT)
    return result
  }

  // 기존 댓글 수정하기
  async function modifyComment(param: CommentTargetParameter): Promise<void> {
    const response = await axios.patch(
      `${TSBOARD.API}/comment/modify`,
      {
        modifyTargetUid: param.targetUid,
        boardUid: param.boardUid,
        postUid: param.postUid,
        content: param.content,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      },
    )

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_MODIFY_COMMENT} (${response.data.error})`)
    }

    util.snack(TEXT[home.lang].MODIFIED_COMMENT)
  }

  return {
    newComment,
    replyComment,
    modifyComment,
  }
})
