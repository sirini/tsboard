/**
 * interface/admin.ts
 *
 * 관리자 기능과 관련된 인터페이스
 */

export type AdminBreadcrumb = {
  title: string
  href: string
  disabled: boolean
}

export type AdminPair = {
  uid: number
  name: string
}

export type AdminUserInfo = AdminPair & {
  profile: string
}

export type AdminBoardConfigGroup = {
  selected: string
  list: AdminPair[]
}

export type BoardType = "board" | "gallery" | "blog"

export type AdminBoardConfig = AdminPair & {
  id: string
  type: BoardType
  groups: AdminPair[]
  groupUid: number
  info: string
  row: number
  width: number
  categories: AdminPair[]
}

export const ACTION_TYPE = {
  LIST: 0,
  VIEW: 1,
  WRITE: 2,
  COMMENT: 3,
  DOWNLOAD: 4,
}

export interface AdminPermissionLevel {
  list: number
  view: number
  write: number
  comment: number
  download: number
}

export interface AdminBoardPermission {
  uid: number
  id: string
  admin: AdminUserInfo
  level: AdminPermissionLevel
}

export interface AdminPointPair {
  isPayment: boolean
  amount: number
}

export type AdminBoardPointList = {
  view: AdminPointPair
  write: AdminPointPair
  comment: AdminPointPair
  download: AdminPointPair
}

export type AdminPoint = AdminBoardPointList & {
  uid: number
}

type AdminGroupCommon = {
  uid: number
  id: string
  manager: AdminUserInfo
}

export type AdminGroupList = AdminGroupCommon & {
  name: string
  info: string
}

export type AdminGroupConfig = AdminGroupCommon & {
  count: number
}

export type AdminDashboardStat = {
  total: number
  yesterday: number
  today: number
}

export type AdminDate = {
  today: number
  yesterday: number
  daybefore: number
}

export type AdminMemberTable = AdminPair & {
  id: string
  profile: string
  level: number
  point: number
  signup: string
}

export type AdminReport = {
  to: AdminUserInfo
  from: AdminUserInfo
  request: string
  response: string
  date: number
}

export type AdminLatest = {
  uid: number
  id?: string
  content: string
}

type AdminLatestCommon = {
  id: string
  uid: number
  like: number
  date: number
  status: number
}

export type AdminLatestPost = AdminLatestCommon & {
  title: string
  writer: AdminUserInfo
  comment: number
  hit: number
}

export type AdminLatestComment = AdminLatestCommon & {
  content: string
  writer: AdminUserInfo
}

type AdminSearchCommon = {
  page: number
  bunch: number
  total: number
}

export type AdminSearchParams = AdminSearchCommon & {
  option: string
  keyword: string
}

export type AdminReportParams = AdminSearchCommon & {
  isSolved: boolean
}
