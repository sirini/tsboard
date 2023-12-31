/**
 * store/comment
 *
 * 게시판, 갤러리의 댓글 상태 및 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { useUtilStore } from "./util"
import { Comment } from "../interface/board"

export const useCommentStore = defineStore("comment", () => {
  const util = useUtilStore()
  const modifyTarget = ref<number>(0)
  const replyTarget = ref<number>(0)
  const removeTarget = ref<number>(0)
  const content = ref<string>("")
  const contentWithSyntax = ref<string>("")
  const button = ref<string>("새 댓글 작성하기")
  const confirmRemoveCommentDialog = ref<boolean>(false)
  const comments = ref<Comment[]>([
    {
      uid: 15,
      replyTarget: 0,
      postUid: 3,
      writer: {
        uid: 3,
        name: "홍길동",
        profile: "/no-profile.png",
      },
      content: "여기에 댓글 내용이 나옵니다",
      like: 5,
      reply: 2,
      date: "2023-10-22 17:48:11",
      liked: false,
    },
    {
      uid: 30,
      replyTarget: 0,
      postUid: 3,
      writer: {
        uid: 31,
        name: "정비공장장",
        profile: "/no-profile.png",
      },
      content: "여기에 추가로 댓글 내용이 나옵니다",
      like: 1,
      reply: 0,
      date: "2023-12-04 12:51:18",
      liked: true,
    },
  ])

  // 댓글에 답글달기 시 대상 지정
  function setReplyComment(uid: number, comment: string, html: boolean = true): void {
    replyTarget.value = uid
    if (html) {
      content.value = `<blockquote>${comment}</blockquote><p>&nbsp;</p>`
    } else {
      content.value = comment
    }
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

  // 댓글에 좋아요 추가 (혹은 취소) 하기
  function like(uid: number, liked: boolean): void {
    // do something with uid
  }

  // 문법 강조까지 모두 포함된 글 내용 업데이트하기
  function updateRealHtml(html: string): void {
    contentWithSyntax.value = html
  }

  // 댓글 작성하기
  async function save(): Promise<void> {
    if (content.value.length < 2) {
      util.snack("댓글 내용이 너무 짧습니다. 최소 2글자 이상 입력해 주세요.")
      return
    }

    if (replyTarget.value > 0) {
      await saveReplyComment()
    } else if (modifyTarget.value > 0) {
      await modifyComment()
    } else {
      await saveNewComment()
    }
    content.value = ""
    contentWithSyntax.value = ""
  }

  // 새 댓글 작성하기
  async function saveNewComment(): Promise<void> {
    // do something
    comments.value.push({
      uid: 20,
      replyTarget: 0,
      postUid: 3,
      writer: {
        uid: 3,
        name: "새글맨",
        profile: "/no-profile.png",
      },
      content: contentWithSyntax.value,
      like: 1,
      reply: 0,
      date: "2023-11-26 21:31:11",
      liked: false,
    })
    util.snack("새 댓글을 남겼습니다.")
  }

  // 답글 작성하기
  async function saveReplyComment(): Promise<void> {
    // do something
    comments.value.push({
      uid: 19,
      replyTarget: 15,
      postUid: 3,
      writer: {
        uid: 3,
        name: "대댓맨",
        profile: "/no-profile.png",
      },
      content: contentWithSyntax.value,
      like: 1,
      reply: 0,
      date: "2023-11-26 21:24:11",
      liked: false,
    })
    util.snack("답글을 남겼습니다.")
  }

  // 기존 댓글 수정하기
  async function modifyComment(): Promise<void> {
    // do something
    util.snack("기존 댓글을 수정하였습니다.")
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
      util.snack("삭제할 대상이 지정되지 않았습니다.")
      return
    }
    // do something with removeTarget
    comments.value = comments.value.filter((comment: Comment) => {
      return removeTarget.value !== comment.uid
    })
    util.snack("댓글이 정상적으로 삭제(혹은 비공개) 되었습니다.")
    closeRemoveCommentDialog()
  }

  return {
    modifyTarget,
    replyTarget,
    removeTarget,
    content,
    button,
    confirmRemoveCommentDialog,
    comments,
    setReplyComment,
    setModifyComment,
    resetCommentMode,
    like,
    save,
    updateRealHtml,
    openRemoveCommentDialog,
    closeRemoveCommentDialog,
    removeComment,
  }
})
