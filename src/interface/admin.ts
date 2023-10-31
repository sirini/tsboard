/**
 * interface/admin.ts
 *
 * 관리자 기능과 관련된 인터페이스
 */

export interface AdminMenuBoard {
  uid: number
  name: string
  info: string
}

export interface AdminMenuBoardGroup {
  uid: number
  name: string
  boards: AdminMenuBoard[]
}

export interface AdminPairItem {
  uid: number
  name: string
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
  group: AdminBoardConfigGroup
  name: string
  info: string
  width: number
  rows: number
  category: AdminBoardCategory
}

export interface AdminBoardPoint {
  payment: 0 | 1
  point: number
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
  admin: string
}

export interface AdminGroupConfig {
  uid: number
  id: string
  manager: AdminPairItem
}