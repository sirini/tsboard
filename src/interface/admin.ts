/**
 * interface/admin.ts
 *
 * 관리자 기능과 관련된 인터페이스
 */

export interface AdminBreadcrumb {
  title: string
  disabled: boolean
  href: string
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
  manager: string
}

export interface AdminGroupConfig {
  uid: number
  id: string
  manager: AdminPairItem
}

export interface AdminHomeSimpleStatus {
  total: number
  yesterday: number
  today: number
}
