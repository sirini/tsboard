/**
 * server/database/board/const
 *
 * 게시판 작업에 필요한 상수 기본값들, 타입들 정의
 */

import {
  BoardConfig,
  Comment,
  CommentRelated,
  Post,
  PostRelated,
  PostView,
} from "../../../src/interface/board"
import { Exif } from "../../../src/interface/gallery"
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
  rowCount: 0,
  width: 0,
  useCategory: false,
  category: [{ uid: 0, name: "" }],
  level: { list: 0, view: 0, write: 0, comment: 0, download: 0 },
  point: { view: 0, write: 0, comment: 0, download: 0 },
}

export const BOARD_TYPE = {
  BOARD: 0,
  GALLERY: 1,
  BLOG: 2,
  SHOP: 3,
}

export const ACTION_TARGET = {
  LIST: 0,
  PAGING: 1,
  VIEW: 2,
  WRITE: 3,
  MODIFY: 4,
}

export const CONTENT_STATUS = {
  REMOVED: -1,
  NORMAL: 0,
  NOTICE: 1,
  SECRET: 2,
}

export const POINT_HISTORY_TYPE = {
  VIEW: 0,
  WRITE_POST: 1,
  WRITE_COMMENT: 2,
  DOWNLOAD: 3,
}

export const SEARCH_OPTION = {
  TITLE: 0,
  CONTENT: 1,
  WRITER: 2,
  TAG: 3,
  CATEGORY: 4,
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
  content: "",
  hit: 0,
  cover: "",
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

export const READ_POST_KEY = "tsboardReadPosts"
export const AUTO_SAVE_KEY = "tsboardAutoSave"

export const INIT_EXIF: Exif = {
  make: "",
  model: "",
  aperture: 0,
  iso: 0,
  focalLength: 0,
  exposure: 0,
  width: 0,
  height: 0,
  date: 0,
}

export const INIT_PHOTO_ITEM = {
  file: {
    uid: 0,
    path: "",
  },
  thumbnail: {
    large: "",
    small: "",
  },
  exif: INIT_EXIF,
  description: "",
}

export const EXIF_APERTURE_FACTOR = 100
export const EXIF_EXPOSURE_FACTOR = 1000000
