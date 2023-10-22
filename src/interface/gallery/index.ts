/**
 * interface/gallery/index.ts
 *
 * 갤러리에서 사용되는 각종 인터페이스 모음
 */

export interface Position {
  x: number
  y: number
}

export interface GalleryImage {
  uid: number
  src: string
}