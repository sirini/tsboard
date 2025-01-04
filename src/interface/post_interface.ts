import {
  BoardAttachedImage,
  BoardConfig,
  BoardExif,
  BoardFile,
  BoardThumbnail,
  BoardWriter,
} from "./board_interface"

// localStorage용 키 값
export const AUTO_SAVE_KEY = "tsboardAutoSave"
export const READ_POST_KEY = "tsboardReadPosts"

// 자동 저장 타입 정의
export type AutoSaved = {
  title: string
  contentWithSyntax: string
  tags: string
}

// 갤러리 그리드형 반환타입 정의
export type GalleryGridItem = {
  uid: number
  like: number
  liked: boolean
  writer: BoardWriter
  comment: number
  title: string
  images: BoardAttachedImage[]
}

// 갤러리 리스트 반환 타입 정의
export type GalleryListResult = {
  config: BoardConfig
  images: GalleryGridItem[]
  totalPostCount: number
}

// 갤러리 사진 보기 반환 타입 정의
export type GalleryPhotoResult = {
  config: BoardConfig
  images: BoardAttachedImage[]
}

// 갤러리용 좌표 타입 정의
export interface Position {
  x: number
  y: number
}

// 갤러리용 이미지 타입 정의
export type PhotoItem = {
  file: BoardFile
  thumbnail: BoardThumbnail
  exif: BoardExif
  description: string
}
