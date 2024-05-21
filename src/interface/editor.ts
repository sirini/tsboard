/**
 * interface/editor
 *
 * 글작성, 수정과 관련된 인터페이스
 */

import { CommonPairParam } from "./board"

export type WritePostParams = CommonPairParam & {
  categoryUid: number
  title: string
  content: string
  isNoticePost: boolean
  isSecretPost: boolean
}

export type ModifyPostParams = WritePostParams & {
  postUid: number
}

export type VideoURL = {
  src: string
  width: number
  height: number
}

export type TableOption = {
  rows: number
  cols: number
  withHeaderRow: boolean
}

export type UploadImageParams = CommonPairParam & {
  images: File[]
}

export type LoadImageParams = CommonPairParam & {
  lastUid: number
  bunch: number
  maxUid: number
}
