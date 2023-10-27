/**
 * store/comment.ts
 *
 * 게시판, 갤러리의 댓글 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { useUtilStore } from "./util"

export const useCommentStore = defineStore("comment", () => {
  const util = useUtilStore()
  const modifyTarget = ref<number>(0)
  const replyTarget = ref<number>(0)
  const removeTarget = ref<number>(0)
  const liked = ref<boolean>(false)
  const bookmarked = ref<boolean>(false)
  const content = ref<string>("")
  const button = ref<string>("새 댓글 작성하기")
  const confirmRemoveCommentDialog = ref<boolean>(false)

  // 댓글에 답글달기 시 대상 지정
  function setReplyComment(uid: number, comment: string): void {
    replyTarget.value = uid
    content.value = `<blockquote>${comment}</blockquote><p>&nbsp;</p>`
    button.value = "기존 댓글에 답글달기"
    util.snack("기존 댓글에 답글을 답니다. 답글 대상 내용이 작성란에 인용 되었습니다.")
  }

  // 댓글 수정하기 클릭 시 대상 지정
  function setModifyComment(uid: number, comment: string): void {
    modifyTarget.value = uid
    content.value = comment
    button.value = "내 댓글 내용 수정하기"
    util.snack("내가 작성한 댓글 내용을 수정합니다. 기존에 작성된 댓글이 작성란에 복사 되었습니다.")
  }

  // 댓글 작성 모드를 새 댓글로 초기화 (답글, 수정 취소)
  function resetCommentMode(): void {
    replyTarget.value = 0
    modifyTarget.value = 0
    button.value = "새 댓글 작성하기"
    content.value = ""
    util.snack("새로운 댓글 작성으로 작성란을 초기화합니다.")
  }

  // 댓글 삭제하기 시 확인창 띄우기
  function confirmRemoveComment(uid: number): void {
    removeTarget.value = uid
    confirmRemoveCommentDialog.value = true
  }

  // 댓글에 좋아요 추가 (혹은 취소) 하기
  function toggleLikeStatus(uid: number): void {
    // do something with uid
    liked.value = !liked.value
  }

  return {
    modifyTarget,
    replyTarget,
    removeTarget,
    content,
    button,
    confirmRemoveCommentDialog,
    liked,
    bookmarked,
    setReplyComment,
    setModifyComment,
    resetCommentMode,
    confirmRemoveComment,
    toggleLikeStatus,
  }
})
