/**
 * interface/board/index.ts
 *
 * 게시판에서 사용되는 각종 인터페이스 모음
 */

export type Pair = {
  uid: number
  name: string
}

export type Writer = Pair & {
  profile: string
}

type ContentCommon = {
  uid: number
  writer: Writer
  content: string
  like: number
  reply: number
  date: string
  liked: boolean
}

export type Post = ContentCommon & {
  category: Pair
  subject: string
  view: number
}

export type Comment = ContentCommon & {
  replyTarget: number
  postUid: number
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
