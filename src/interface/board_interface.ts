import { UserBasicInfo } from "./user_interface"

// 게시판 타입 재정의
export type Board = 0 | 1 | 2 | 3

// 게시판 타입 기본값
export const BOARD = {
  DEFAULT: 0,
  GALLERY: 1,
  BLOG: 2,
  SHOP: 3,
}

// 게시글 상태 재정의
export type Status = -1 | 0 | 1 | 2

// 게시글 상태 기본값
export const STATUS = {
  REMOVED: -1,
  NORMAL: 0,
  NOTICE: 1,
  SECRET: 2,
}

// 레벨 타입 정의
export type BoardActionPoint = {
  view: number
  write: number
  comment: number
  download: number
}

// 레벨 타입 기본값 정의
export const BOARD_ACTION_POINT: BoardActionPoint = {
  view: 0,
  write: 0,
  comment: 0,
  download: 0,
}

// 포인트 타입 정의
export type BoardActionLevel = BoardActionPoint & {
  list: number
}

// 포인트 타입 기본값 정의
export const BOARD_ACTION_LEVEL: BoardActionLevel = {
  view: 0,
  write: 0,
  comment: 0,
  download: 0,
  list: 0,
}

// 게시판 일반 설정 불러오기 반환 타입
export type BoardConfig = {
  uid: number
  id: string
  groupUid: number
  admin: {
    group: number
    board: number
  }
  type: Board
  name: string
  info: string
  rowCount: number
  width: number
  useCategory: boolean
  category: Pair[]
  level: BoardActionLevel
  point: BoardActionPoint
}

// 게시판 일반 설정 불러오기 기본값 정의
export const BOARD_CONFIG: BoardConfig = {
  uid: 0,
  id: "",
  groupUid: 0,
  admin: { group: 0, board: 0 },
  type: 0,
  name: "",
  info: "",
  rowCount: 0,
  width: 0,
  useCategory: false,
  category: [] as Pair[],
  level: BOARD_ACTION_LEVEL,
  point: BOARD_ACTION_POINT,
}

// 게시글 작성자 타입 정의
export type BoardWriter = UserBasicInfo & {
  signature: string
}

// 게시글 작성자 기본값 정의
export const BOARD_WRITER: BoardWriter = {
  uid: 0,
  name: "",
  profile: "",
  signature: "",
}

// 값 2개 (Pair) 타입 정의
export type Pair = {
  uid: number
  name: string
}

// 값 3개 (Triple) 타입 정의
export type Triple = Pair & {
  id: string
}
