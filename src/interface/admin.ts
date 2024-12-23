/**
 * interface/admin.ts
 *
 * 관리자 기능과 관련된 인터페이스
 */

import { BoardType, Writer } from "./board"

export type AdminBreadcrumb = {
  title: string
  href: string
  disabled: boolean
}

export type AdminPair = {
  uid: number
  name: string
}

export type AdminTriple = AdminPair & {
  id: string
}

export type AdminUserInfo = AdminPair & {
  profile: string
}

export type AdminBoardConfigGroup = {
  selected: string
  list: AdminPair[]
}

export type AdminBoardConfig = AdminPair & {
  id: string
  type: BoardType
  groups: AdminPair[]
  groupUid: number
  info: string
  rowCount: number
  width: number
  useCategory: boolean
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

type AdminGroupTotalCount = {
  post: number
  comment: number
  file: number
  image: number
}

export type AdminGroupList = AdminGroupCommon & {
  type: BoardType
  name: string
  info: string
  total: AdminGroupTotalCount
}

export type AdminGroupConfig = AdminGroupCommon & {
  count: number
}

export type AdminDashboardStat = {
  total: number
  yesterday: number
  today: number
}

export type AdminDashboardTableName =
  | "user_access_log"
  | "user"
  | "post"
  | "comment"
  | "file"
  | "image"
export type AdminDashboardTableColumn = "timestamp" | "signup" | "submitted"

export type AdminDashboardStatusItem = {
  date: number
  visit: number
}

export type AdminDashboardStatus = {
  history: AdminDashboardStatusItem[]
  total: number
}

export type AdminDashboardResult = {
  total: number
  labels: string[]
  values: number[]
}

export type AdminUser = AdminPair & {
  id: string
  profile: string
  level: number
  point: number
  signup: number
}

export type AdminReport = {
  to: AdminUserInfo
  from: AdminUserInfo
  request: string
  response: string
  date: number
}

export type AdminReportLatest = {
  uid: number
  content: string
  writer: Writer
}

export type AdminLatest = {
  uid: number
  id: string
  type: BoardType
  content: string
  writer: AdminUserInfo
}

type AdminLatestEssential = {
  id: string
  type: BoardType
  like: number
}

export type AdminLatestRelatedResults = AdminLatestEssential & {
  writer: AdminUserInfo
  comment: number
}

type AdminLatestCommon = AdminLatestEssential & {
  uid: number
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
  postUid: number
}

type AdminList = {
  page: number
  bunch: number
  maxUid: number
}

export type AdminSearchCommon = AdminList & {
  option: string
  keyword: string
}

export type AdminReportParams = AdminSearchCommon & {
  isSolved: boolean
}

export type AdminUserParams = AdminSearchCommon & {
  isBlocked: boolean
}

export type AdminUserModifyParams = {
  userUid: number
  name: string
  level: number
  point: number
  signature: string
  password: string
  profile: File | undefined
}
