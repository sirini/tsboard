/**
 * store/board/const
 *
 * 게시판 스토어들에 사용되는 상수 기본값들 정의
 * 주의) 백엔드에서 정의된 동일 이름의 값들은 클라이언트에서 사용금지
 */

import { BoardConfig, Post } from "../../interface/board"

export const TYPE_MATCH = [
  { path: "/board/", name: "boardList" },
  { path: "/gallery/", name: "galleryList" },
  { path: "/blog/", name: "blogList" },
]

export const INIT_CONFIG: BoardConfig = {
  uid: 0,
  admin: { group: 0, board: 0 },
  type: 0,
  name: "",
  info: "",
  row: 0,
  width: 0,
  useCategory: false,
  category: [],
  level: { list: 0, view: 0, comment: 0, write: 0, download: 0 },
  point: { view: 0, comment: 0, write: 0, download: 0 },
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
