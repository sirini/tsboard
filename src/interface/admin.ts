/**
 * interface/admin.ts
 *
 * 관리자 기능과 관련된 인터페이스
 */

export interface AdminBreadcrumb {
  title: string
  href: string
  disabled: boolean
}

export interface AdminPairItem {
  uid: number
  name: string
  profile?: string
}

export interface AdminBoardConfigGroup {
  selected: string
  list: AdminPairItem[]
}

export interface AdminBoardCategory {
  add: string
  remove: AdminPairItem
  list: AdminPairItem[]
}

export interface AdminBoardConfig {
  uid: number
  id: string
  type: string
  group: string
  name: string
  info: string
  rows: number
  width: number
  category: AdminBoardCategory
}

export interface AdminBoardPoint {
  isPayment: boolean
  amount: number
}

export interface AdminBoardPointList {
  view: AdminBoardPoint
  write: AdminBoardPoint
  comment: AdminBoardPoint
  download: AdminBoardPoint
}

export interface AdminUserActivity {
  list: number
  view: number
  write: number
  comment: number
  download: number
}

export interface AdminGroupList {
  uid: number
  id: string
  info: string
  manager: string
}

export interface AdminGroupConfig {
  uid: number
  id: string
  count: number
  manager: AdminPairItem
}

export interface AdminHomeSimpleStatus {
  total: number
  yesterday: number
  today: number
}

export interface AdminMemberTable {
  uid: number
  id: string
  name: string
  profile: string
  level: number
  point: number
  signup: string
}

export interface AdminMemberReport {
  to: AdminPairItem
  from: AdminPairItem
  request: string
  response: string
  date: string
}

export interface AdminLatestPost {
  id: string
  uid: number
  title: string
  writer: AdminPairItem
  comment: number
  like: number
  hit: number
  date: string
}

export interface AdminLatestComment {
  id: string
  uid: number
  content: string
  writer: AdminPairItem
  like: number
  date: string
}
