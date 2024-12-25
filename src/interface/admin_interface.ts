import {
  BOARD_ACTION_LEVEL,
  BOARD_WRITER,
  Board,
  BoardActionLevel,
  BoardActionPoint,
  BoardConfig,
  BoardWriter,
  Pair,
  Status,
} from "./board_interface"
import { UserBasicInfo } from "./user_interface"

// 관리화면용 활동 타입 정의
export const ADMIN_ACTION = {
  LIST: 0,
  VIEW: 1,
  WRITE: 2,
  COMMENT: 3,
  DOWNLOAD: 4,
}

// 관리화면 상단 경로 표시줄용 타입
export type AdminBreadcrumb = {
  title: string
  href: string
  disabled: boolean
}

// 게시판 레벨 제한 반환 타입 정의
export type AdminBoardLevelPolicy = {
  uid: number
  admin: BoardWriter
  level: BoardActionLevel
}

// 게시판 설정 반환값 정의
export type AdminBoardResult = {
  config: BoardConfig
  groups: Pair[]
}

// 게시판 레벨 제한 기본값 정의
export const ADMIN_BOARD_LEVEL_POLICY: AdminBoardLevelPolicy = {
  uid: 0,
  admin: BOARD_WRITER,
  level: BOARD_ACTION_LEVEL,
}

// 게시판 포인트 정책 반환값 정의
export type AdminBoardPointPolicy = BoardActionPoint & {
  uid: number
}

// 게시판 포인트 정책 기본값 정의
export const ADMIN_BOARD_POINT_POLICY: AdminBoardPointPolicy = {
  view: 0,
  write: 0,
  comment: 0,
  download: 0,
  uid: 0,
}

// 대시보드 아이템(그룹, 게시판, 회원 최신순 목록) 반환값 정의
export type AdminDashboardItem = {
  groups: Pair[]
  boards: Pair[]
  members: BoardWriter[]
}

// 대시보드 최근 (댓)글 목록 반환값 정의
export type AdminDashboardLatestContent = AdminDashboardReport & {
  id: string
  type: Board
}

// 대시보드 최근 신고 목록 반환값 정의
export type AdminDashboardReport = {
  uid: number
  content: string
  writer: BoardWriter
}

// 대시보드 최근 (댓)글, 신고 목록 최신순 반환값 정의
export type AdminDashboardLatest = {
  posts: AdminDashboardLatestContent[]
  comments: AdminDashboardLatestContent[]
  reports: AdminDashboardLatestContent[]
}

// 대시보드 최근 통계들 반환값 정의
export type AdminDashboardStatisticResult = {
  visit: AdminDashboardStatistic
  member: AdminDashboardStatistic
  post: AdminDashboardStatistic
  reply: AdminDashboardStatistic
  file: AdminDashboardStatistic
  image: AdminDashboardStatistic
}

// 대시보드 최근 통계 반환값 정의
export type AdminDashboardStatistic = {
  history: AdminDashboardStatus[]
  total: number
}

// 대시보드 일자별 데이터 반환값 정의
export type AdminDashboardStatus = {
  date: number
  visit: number
}

// 그룹 관리화면 게시판 (및 통계) 목록 반환값 정의
export type AdminGroupBoardItem = AdminGroupConfig & {
  type: Board
  name: string
  info: string
  total: AdminGroupBoardStatus
}

// 게시판 별 간단 통계 반환값 정의
export type AdminGroupBoardStatus = {
  post: number
  comment: number
  file: number
  image: number
}

// 게시판 별 간단 통계 기본값 정의
export const ADMIN_GROUP_BOARD_STATUS: AdminGroupBoardStatus = {
  post: 0,
  comment: 0,
  file: 0,
  image: 0,
}

// 그룹 설정 및 소속 게시판들 정보 반환값 정의
export type AdminGroupListResult = {
  config: AdminGroupConfig
  boards: AdminGroupBoardItem[]
}

// 그룹 관리화면 일반 설정들 반환값 정의
export type AdminGroupConfig = {
  uid: number
  id: string
  count: number
  manager: BoardWriter
}

// 그룹 관리화면 일반 설정 기본값 정의
export const ADMIN_GROUP_CONFIG: AdminGroupConfig = {
  uid: 0,
  id: "",
  count: 0,
  manager: BOARD_WRITER,
}

// 최근 (댓)글 출력에 필요한 공통 반환값 정의
export type AdminLatestCommon = {
  uid: number
  id: string
  type: Board
  like: number
  date: number
  status: Status
  writer: BoardWriter
}

// 최근 댓글 반환값 정의
export type AdminLatestComment = AdminLatestCommon & {
  content: string
  postUid: number
}

// 최근 댓글 및 max uid 반환값 정의
export type AdminLatestCommentResult = {
  comments: AdminLatestComment[]
  maxUid: number
}

// 최근 글 반환값 정의
export type AdminLatestPost = AdminLatestCommon & {
  title: string
  comment: number
  hit: number
}

// 최근 글 및 max uid 반환값 정의
export type AdminLatestPostResult = {
  posts: AdminLatestPost[]
  maxUid: number
}

// 신고 목록 반환값 정의
export type AdminReportItem = {
  to: BoardWriter
  from: BoardWriter
  request: string
  response: string
  date: number
}

// 신고 목록 및 max uid 반환값 정의
export type AdminReportResult = {
  reports: AdminReportItem[]
  maxUid: number
}

// 사용자 목록 검색하기 반환값 정의
export type AdminUserItem = UserBasicInfo & {
  id: string
  level: number
  point: number
  signup: number
}

// 사용자 목록 검색 결과 및 max uid 반환값 정의
export type AdminUserItemResult = {
  user: AdminUserItem[]
  maxUid: number
}

// 사용자 정보 반환값 정의
export type AdminUserInfo = BoardWriter & {
  id: string
  level: number
  point: number
}

// 사용자 정보 기본값 정의
export const ADMIN_USER_INFO: AdminUserInfo = {
  uid: 0,
  name: "",
  profile: "",
  signature: "",
  id: "",
  level: 0,
  point: 0,
}
