/**
 * interface/admin.ts
 *
 * 관리자 기능과 관련된 인터페이스
 */

export interface Board {
  uid: number
  name: string
  info: string
  manager: number
}

export interface BoardGroup {
  uid: number
  name: string
  manager: number
  boards: Board[]
}