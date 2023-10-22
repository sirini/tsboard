/**
 * interface/board/index.ts
 *
 * 게시판에서 사용되는 각종 인터페이스 모음
 */

export interface Category {
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
  category: Category
  writer: Writer
  subject: string
  content: string
  like: number
  reply: number
  view: number
  date: string
}

export interface Comment {
  uid: number
  postUid: number
  writer: Writer
  content: string
  like: number
  reply: number
  date: string
}

export interface Attachment {
  uid: number
  filename: string
}