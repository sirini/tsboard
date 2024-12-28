export type WritePostParams = {
  boardUid: number
  accessUserUid: number
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

export type UploadImageParams = {
  boardUid: number
  accessUserUid: number
  images: File[]
}

export type LoadImageParams = {
  boardUid: number
  accessUserUid: number
  lastUid: number
  bunch: number
  maxUid: number
}
