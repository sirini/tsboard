/**
 * store/board/const
 *
 * 게시판 스토어들에 사용되는 상수 기본값들 정의
 */

import { BoardConfig } from "../../interface/board"

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
