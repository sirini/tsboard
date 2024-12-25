import { defineStore } from "pinia"
import { ref } from "vue"
import { useRoute } from "vue-router"
import { TEXT } from "../../messages/store/board/comment"
import { useHomeStore } from "../home"
import { useAuthStore } from "../user/auth"
import { useUtilStore } from "../util"
import {
  COMMENT_RESULT,
  CommentListResult,
  CommentNewParameter,
  CommentResult,
  CommentTargetParameter,
} from "../../interface/comment_interface"
import { PAGE, Paging } from "../../interface/board_interface"
import axios from "axios"
import { TSBOARD } from "../../../tsboard.config"

export const useCommentStore = defineStore("comment", () => {
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const id = ref<string>("")
  const boardUid = ref<number>(0)
  const postUid = ref<number>(0)
  const sinceUid = ref<number>(0)
  const modifyTarget = ref<number>(0)
  const replyTarget = ref<number>(0)
  const removeTarget = ref<number>(0)
  const content = ref<string>("")
  const contentWithSyntax = ref<string>("")
  const button = ref<string>(TEXT[home.lang].BUTTON_NEW)
  const confirmRemoveCommentDialog = ref<boolean>(false)
  const comments = ref<CommentResult[]>([])
  const page = ref<number>(1)
  const pageLength = ref<number>(1)
  const pagingDirection = ref<Paging>(PAGE.NEXT as Paging)
  const bunch = ref<number>(100)

  // 기존 댓글 불러오기
  async function loadCommentList(): Promise<void> {
    id.value = route.params.id as string
    postUid.value = parseInt(route.params.no as string)

    const response = await axios.get(`${TSBOARD.API}/comment/list`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        id: id.value,
        postUid: postUid.value,
        page: page.value,
        pagingDirection: pagingDirection.value,
        bunch: bunch.value,
        sinceUid: sinceUid.value,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      comments.value = []
      pageLength.value = 1
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_COMMENT} (${response.data.error})`)
    }

    const result = response.data.result as CommentListResult
    boardUid.value = result.boardUid
    comments.value = result.comments
    pageLength.value = Math.ceil(result.totalCommentCount / bunch.value)
  }

  // 댓글에 답글달기 시 대상 지정
  function setReplyComment(uid: number, comment: string, html: boolean = true): void {
    replyTarget.value = uid
    if (html) {
      content.value = `<blockquote>${comment}</blockquote><p>&nbsp;</p>`
    } else {
      content.value = comment
    }
    button.value = TEXT[home.lang].BUTTON_REPLY
    util.snack(TEXT[home.lang].INFO_REPLY)
  }

  // 댓글 수정하기 클릭 시 대상 지정
  function setModifyComment(uid: number, comment: string): void {
    modifyTarget.value = uid
    content.value = comment.replaceAll("<p><br /></p>", "<p>&nbsp;</p>")
    button.value = TEXT[home.lang].BUTTON_MODIFY
    util.snack(TEXT[home.lang].SET_MODIFY_TARGET)
  }

  // 댓글 작성 모드를 새 댓글로 초기화 (답글, 수정 취소)
  function resetCommentMode(): void {
    replyTarget.value = 0
    modifyTarget.value = 0
    button.value = TEXT[home.lang].BUTTON_NEW
    content.value = ""
    util.snack(TEXT[home.lang].RESET_COMMENT_MODE)
  }

  // 댓글에 좋아요 추가 (혹은 취소) 하기
  async function like(commentUid: number, isLike: boolean): Promise<void> {
    const fd = new FormData()
    fd.append("boardUid", boardUid.value.toString())
    fd.append("commentUid", commentUid.toString())
    fd.append("liked", isLike ? "1" : "0")

    const response = await axios.patch(`${TSBOARD.API}/comment/like`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })

    if (response.data && response.data.success === true) {
      comments.value.map((comment: CommentResult) => {
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
    const comment = await newComment({
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
    await modifyComment({
      targetUid: modifyTarget.value,
      boardUid: boardUid.value,
      postUid: postUid.value,
      content: contentWithSyntax.value,
    })

    comments.value.map((comment: CommentResult) => {
      if (comment.uid === modifyTarget.value) {
        comment.content = contentWithSyntax.value
        return
      }
    })
  }

  // 기존 댓글에 답글달기
  async function saveReplyComment(): Promise<void> {
    let targetIndex = 0
    const comment = await replyComment({
      targetUid: replyTarget.value,
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
      util.snack(TEXT[home.lang].TOO_SHORT_COMMENT)
      return
    }
    if (auth.user.uid < 1) {
      util.snack(TEXT[home.lang].NEED_LOGIN)
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

  // 댓글 삭제하기, 답글이 달려있는 댓글은 내용만 제거됨 (isChangeStatus = false)
  async function removeComment(): Promise<void> {
    if (removeTarget.value < 1) {
      return util.snack(TEXT[home.lang].INVALID_REMOVE_TARGET)
    }

    const response = await axios.delete(`${TSBOARD.API}/comment/remove`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        boardUid: boardUid.value,
        removeTargetUid: removeTarget.value,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_REMOVE_COMMENT} (${response.data.error})`)
    }

    if (response.data.result.isChangeStatus === true) {
      comments.value = comments.value.filter((comment: CommentResult) => {
        return removeTarget.value !== comment.uid
      })
    } else {
      comments.value.map((comment: CommentResult) => {
        if (removeTarget.value === comment.uid) {
          comment.content = TEXT[home.lang].NOTE_REMOVED_COMMENT
          return
        }
      })
    }

    util.snack(TEXT[home.lang].REMOVED_COMMENT)
    closeRemoveCommentDialog()
  }

  // 새 댓글 작성하기
  async function newComment(param: CommentNewParameter): Promise<CommentResult> {
    let result: CommentResult = COMMENT_RESULT

    const fd = new FormData()
    fd.append("boardUid", param.boardUid.toString())
    fd.append("postUid", param.postUid.toString())
    fd.append("content", param.content)

    const response = await axios.post(`${TSBOARD.API}/comment/write`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })

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

    const fd = new FormData()
    fd.append("replyTargetUid", param.targetUid.toString())
    fd.append("postUid", param.boardUid.toString())
    fd.append("content", param.content)

    const response = await axios.post(`${TSBOARD.API}/comment/reply`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })

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
    const fd = new FormData()
    fd.append("modifyTargetUid", param.targetUid.toString())
    fd.append("boardUid", param.boardUid.toString())
    fd.append("postUid", param.postUid.toString())
    fd.append("content", param.content)

    const response = await axios.patch(`${TSBOARD.API}/comment/modify`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_MODIFY_COMMENT} (${response.data.error})`)
    }

    util.snack(TEXT[home.lang].MODIFIED_COMMENT)
  }

  return {
    id,
    boardUid,
    postUid,
    modifyTarget,
    replyTarget,
    removeTarget,
    content,
    contentWithSyntax,
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
