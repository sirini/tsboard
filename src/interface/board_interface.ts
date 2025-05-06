import { UserBasicInfo } from "./user_interface"

// 게시글 작성/수정 실패 리턴값 정의
export const WRITE_RESULT_FAIL = -1

// 게시판 타입 재정의
export type Board = 0 | 1 | 2 | 3

// 게시판 타입 기본값
export const BOARD = {
  DEFAULT: 0,
  GALLERY: 1,
  BLOG: 2,
  WEBZINE: 3,
  TRADE: 4,
}

// 게시판 내 활동 기본값 정의
export const BOARD_ACTION = {
  LIST: 0,
  PAGING: 1,
  VIEW: 2,
  WRITE: 3,
  MODIFY: 4,
}

// 게시판 타입 매칭용 배열 정의
export const CONVERT_BOARD_TYPE = [
  { path: "/board/", name: "boardList" },
  { path: "/gallery/", name: "galleryList" },
  { path: "/blog/", name: "blogList" },
  { path: "/webzine/", name: "webzineList" },
  { path: "/trade/", name: "tradeList" },
]

// 게시글 작성자 기본값 정의
export const BOARD_WRITER: BoardWriter = {
  uid: 0,
  name: "",
  profile: "",
  signature: "",
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

// 게시판 첨부파일 구조체 정의
export type BoardAttachment = Pair & {
  size: number
}

// 게시글 작성자의 최근 글/댓글에 전달할 게시판 기본 설정값 정의
export type BoardBasicConfig = {
  id: string
  type: Board
  name: string
}

// 파일 기본 구조 정의
export type BoardFile = {
  uid: number
  path: string
}

// 게시글 이동에 필요한 게시판 목록 타입 정의
export type BoardItem = Pair & {
  info: string
}

// 게시판 첨부 이미지 구조체 정의
export type BoardAttachedImage = {
  file: BoardFile
  thumbnail: BoardThumbnail
  exif: BoardExif
  description: string
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
  width: 1000,
  useCategory: false,
  category: [] as Pair[],
  level: BOARD_ACTION_LEVEL,
  point: BOARD_ACTION_POINT,
}

// 홈화면 게시글 공통 리턴 타입 정의
export type BoardCommonPostItem = {
  uid: number
  title: string
  content: string
  submitted: number
  modified: number
  hit: number
  status: Status
}

// 게시글 목록보기에 추가로 필요한 리턴 타입 정의
export type BoardCommonListItem = {
  category: Pair
  cover: string
  comment: number
  like: number
  liked: boolean
  writer: BoardWriter
}

// EXIF 구조체 정의
export type BoardExif = {
  make: string
  model: string
  aperture: number
  iso: number
  focalLength: number
  exposure: number
  width: number
  height: number
  date: number
}

// 게시글 목록보기용 리턴 타입 정의
export type BoardListItem = BoardCommonPostItem & BoardCommonListItem

// 게시글 목록보기용 기본값 정의
export const BOARD_LIST_ITEM: BoardListItem = {
  uid: 0,
  title: "",
  content: "",
  submitted: 0,
  modified: 0,
  hit: 0,
  status: STATUS.NORMAL as Status,
  category: { uid: 0, name: "" },
  cover: "",
  comment: 0,
  like: 0,
  liked: false,
  writer: BOARD_WRITER,
}

// 게시글 목록보기 리턴 값 정의
export type BoardListResult = {
  totalPostCount: number
  config: BoardConfig
  notices: BoardListItem[]
  posts: BoardListItem[]
  blackList: number[]
  isAdmin: boolean
}

// 썸네일 크기별 종류 정의
export type BoardThumbnail = {
  large: string
  small: string
}

// 첨부파일 다운로드 결과 정의
export type BoardViewDownloadResult = {
  name: string
  path: string
}

// 게시글 보기에 반환 타입 정의
export type BoardViewResult = {
  config: BoardConfig
  post: BoardListItem
  images: BoardAttachedImage[]
  files: BoardAttachment[]
  tags: Pair[]
  prevPostUid: number
  nextPostUid: number
  writerPosts: BoardWriterLatestPost[]
  writerComments: BoardWriterLatestComment[]
}

// 게시글 작성자 타입 정의
export type BoardWriter = UserBasicInfo & {
  signature: string
}

// 글 작성자의 최근 (댓)글 공통 타입 정의
type WriterLatestCommon = {
  board: BoardBasicConfig
  postUid: number
  like: number
  submitted: number
}

// 글 작성자의 최근 댓글 타입 정의
export type BoardWriterLatestComment = WriterLatestCommon & {
  content: string
}

// 글 작성자의 최근 글 타입 정의
export type BoardWriterLatestPost = WriterLatestCommon & {
  comment: number
  title: string
}

// 태그 자동완성 결과 타입 정의
export type EditorTagItem = Pair & {
  count: number
}

// 에디터에서 게시판 설정 및 카테고리 불러오기 결과 타입 정의
export type EditorConfigResult = {
  config: BoardConfig
  isAdmin: boolean
  categories: Pair[]
}

// 게시글에 삽입한 이미지 목록 반환 타입 정의
export type EditorInsertImageResult = {
  images: Pair[]
  maxImageUid: number
  totalImageCount: number
}

// 게시글 수정 시 가져오는 정보들 반환 타입 정의
export type EditorLoadPostResult = {
  post: BoardListItem
  files: BoardAttachment[]
  tags: Pair[]
}

// 값 2개 (Pair) 타입 정의
export type Pair = {
  uid: number
  name: string
}

// 페이징 이동 방향 타입 정의
export type Paging = -1 | 1

// 페이징 이동 방향 기본값
export const PAGE = {
  PREV: -1,
  NEXT: 1,
}

// 값 3개 (Triple) 타입 정의
export type Triple = Pair & {
  id: string
}

// 검색 옵션 타입 정의
export type Search = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

// 검색 옵션 기본값
export const SEARCH = {
  TITLE: 0,
  CONTENT: 1,
  WRITER: 2,
  TAG: 3,
  CATEGORY: 4,
  REPORT: {
    TO: 5,
    FROM: 6,
    REQUEST: 7,
    RESPONSE: 8,
  },
  USER: {
    NAME: 9,
    ID: 10,
    LEVEL: 11,
  },
  IMAGEDESC: 12,
  NONE: 13,
}
