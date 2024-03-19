/**
 * server/database/board/const
 *
 * 게시판 작업에 필요한 상수 기본값들, 타입들 정의
 */

import {
  BoardConfig,
  Comment,
  CommentRelated,
  Pair,
  Post,
  PostRelated,
  PostView,
  Writer,
} from "../../../src/interface/board"
import { INIT_USER_BASIC } from "../../../src/interface/user"

export const TYPE_MATCH = [
  { path: "/board/", name: "boardList" },
  { path: "/gallery/", name: "galleryList" },
  { path: "/blog/", name: "blogList" },
  { path: "/shop/", name: "shopList" },
]

export const BOARD_CONFIG: BoardConfig = {
  uid: 0,
  admin: { group: 0, board: 0 },
  type: 0,
  name: "",
  info: "",
  row: 0,
  width: 0,
  useCategory: false,
  category: [{ uid: 0, name: "" }],
  level: { list: 0, view: 0, write: 0, comment: 0, download: 0 },
  point: { view: 0, write: 0, comment: 0, download: 0 },
}

export const PAGING_DIRECTION = {
  PREV: -1,
  NEXT: 1,
}

export const POST_RELATED: PostRelated = {
  writer: INIT_USER_BASIC,
  like: 0,
  liked: false,
  category: { uid: 0, name: "" },
  reply: 0,
}

export const INIT_POST: Post = {
  uid: 0,
  writer: { uid: 0, name: "", profile: "", signature: "" },
  like: 0,
  liked: false,
  submitted: 0,
  status: 0,
  category: { uid: 0, name: "" },
  reply: 0,
  title: "",
  hit: 0,
}

export const INIT_POST_VIEW: PostView = {
  ...INIT_POST,
  content: "",
  modified: 0,
}

export const INIT_COMMENT: Comment = {
  uid: 0,
  writer: { uid: 0, name: "", profile: "", signature: "" },
  content: "",
  like: 0,
  liked: false,
  submitted: 0,
  modified: 0,
  status: 0,
  replyUid: 0,
  postUid: 0,
}

export const COMMENT_RELATED: CommentRelated = {
  writer: INIT_USER_BASIC,
  like: 0,
  liked: false,
}

export const INVALID_VIEW_LEVEL = 99

export const NOTICE_TYPE = {
  LIKE_POST: 0,
  LIKE_COMMENT: 1,
  LEAVE_COMMENT: 2,
  REPLY_COMMENT: 3,
  CHAT_MESSAGE: 4,
}
