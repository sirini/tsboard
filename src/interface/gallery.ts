/**
 * interface/gallery/index.ts
 *
 * 갤러리에서 사용되는 각종 인터페이스 모음
 */

import { PhotoItem } from "./board"

export interface Position {
  x: number
  y: number
}

export interface Writer {
  uid: number
  name: string
  profile: string
}

export type GridItem = {
  uid: number
  writer: Writer
  like: number
  liked: boolean
  reply: number
  images: PhotoItem[]
}

export type Exif = {
  make: string
  model: string
  aperture: number
  iso: number
  focalLength: number
  exposure: number
  width: number
  height: number
  date: number
}
