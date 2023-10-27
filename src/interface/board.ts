/**
 * interface/board/index.ts
 *
 * 게시판에서 사용되는 각종 인터페이스 모음
 */

export interface Pair {
  uid: number
  name: string
}

export interface Writer {
  uid: number
  name: string
  profile: string
}

export interface Post {
  uid: number
  category: Pair
  writer: Writer
  subject: string
  content: string
  like: number
  reply: number
  view: number
  date: string
  liked: boolean
}

export interface Comment {
  uid: number
  postUid: number
  writer: Writer
  content: string
  like: number
  reply: number
  date: string
  liked: boolean
}

export interface VideoURL {
  src: string
  width: number
  height: number
}

export interface TableOption {
  rows: number
  cols: number
  withHeaderRow: boolean
}
