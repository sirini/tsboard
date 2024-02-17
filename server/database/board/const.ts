/**
 * server/database/board/const
 *
 * 게시판 작업에 필요한 상수 기본값들, 타입들 정의
 */

import { BoardConfig, Pair, Post, Writer } from "../../../src/interface/board"

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

export type CommentRelated = {
  writer: Writer
  like: number
  liked: boolean
}

export type PostRelated = CommentRelated & {
  category: Pair
  reply: number
}

export const POST_RELATED: PostRelated = {
  writer: { uid: 0, name: "", profile: "" },
  like: 0,
  liked: false,
  category: { uid: 0, name: "" },
  reply: 0,
}

export const INIT_POST: Post = {
  uid: 0,
  writer: { uid: 0, name: "", profile: "", signature: "" },
  content: "",
  like: 0,
  liked: false,
  submitted: 0,
  modified: 0,
  status: 0,
  category: { uid: 0, name: "" },
  reply: 0,
  title: "",
  hit: 0,
}

export const COMMENT_RELATED: CommentRelated = {
  writer: { uid: 0, name: "", profile: "" },
  like: 0,
  liked: false,
}

export const INVALID_VIEW_LEVEL = 99
