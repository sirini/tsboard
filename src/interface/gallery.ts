/**
 * interface/gallery/index.ts
 *
 * 갤러리에서 사용되는 각종 인터페이스 모음
 */

export interface Position {
  x: number
  y: number
}

export interface Writer {
  uid: number
  name: string
  profile: string
}

export interface GridItem {
  uid: number
  writer: Writer
  files: string[]
  like: number
  reply: number
}

export interface Photo {
  uid: number
  writer: Writer
  files: string[]
  subject: string
  content: string
  like: number
  reply: number
  view: number
  date: string
  liked: boolean
  booked: boolean
}