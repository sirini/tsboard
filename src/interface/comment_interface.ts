import { STATUS } from "./board_interface"
import { UserBasicInfo } from "./user_interface"

// 새 댓글 저장하기에 필요한 파라미터 타입 정의
export type CommentNewParameter = {
  boardUid: number
  postUid: number
  content: string
}

// 답글, 수정하기에 필요한 파라미터 타입 정의
export type CommentTargetParameter = CommentNewParameter & {
  targetUid: number
}

// 댓글(답글) 작성 후 화면에 반영할 때 필요한 타입 정의
export type CommentResult = {
  uid: number
  writer: UserBasicInfo
  content: string
  like: number
  liked: boolean
  submitted: number
  modified: number
  status: number
  replyUid: number
  postUid: number
}

// 댓글(답글) 작성 후 화면에 반영할 때 필요한 기본값 정의
export const COMMENT_RESULT: CommentResult = {
  uid: 0,
  writer: { uid: 0, name: "", profile: "" },
  content: "",
  like: 0,
  liked: false,
  submitted: Date.now(),
  modified: 0,
  status: STATUS.NORMAL,
  replyUid: 0,
  postUid: 0,
}

// 댓글 목록 가져오기 결과 정의
export type CommentListResult = {
  boardUid: number
  sinceUid: number
  totalCommentCount: number
  comments: CommentResult[]
}
