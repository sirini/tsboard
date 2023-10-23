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
  rows: number
  category: AdminBoardCategory
}