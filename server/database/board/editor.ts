/**
 * server/database/board/editor
 *
 * 글작성용 에디터와 관련된 처리
 */

import { table, insert, select, remove } from "../common"
import { LoadImageParams, Pair, UploadImageParams } from "../../../src/interface/board"
import {
  generateRandomID,
  makeSavePath,
  removeFile,
  resizeImage,
  saveUploadedFile,
} from "../../util/tools"
import { exists } from "node:fs/promises"

// 본문 내 삽입용 이미지 업로드
export async function uploadImages(param: UploadImageParams): Promise<string[]> {
  let result: string[] = []
  const savePath = await makeSavePath("images")

  for (const image of param.images) {
    const newSavePath = `${savePath}/${generateRandomID()}.webp`
    const tempFilePath = await saveUploadedFile(image, `./upload/temp/images`)
    const minImageSize = Math.min(parseInt(process.env.IMAGE_SIZE ?? "1024"), param.sizeLimit)

    await resizeImage(tempFilePath, newSavePath, minImageSize)
    removeFile(tempFilePath)

    if ((await exists(newSavePath)) === true) {
      const pathForImage = newSavePath.slice(1)
      insert(
        `INSERT INTO ${table}image (board_uid, user_uid, path, timestamp) VALUES 
      (?, ?, ?, ?)`,
        [param.boardUid, param.accessUserUid, pathForImage, Date.now()],
      )
      result.push(pathForImage)
    }
  }
  return result
}

// 특정 사용자가 업로드한 이미지의 최대 유효 uid 값 반환하기
export async function getMaxImageUid(boardUid: number, accessUserUid: number): Promise<number> {
  const [max] = await select(
    `SELECT MAX(uid) AS uid FROM ${table}image WHERE board_uid = ? AND user_uid = ?`,
    [boardUid, accessUserUid],
  )
  if (!max) {
    return 0
  }
  return max.uid
}

// 특정 사용자가 총 업로드한 이미지들 불러오기
export async function getTotalImageCount(boardUid: number, accessUserUid: number): Promise<number> {
  const [total] = await select(
    `SELECT COUNT(*) AS count FROM ${table}image WHERE board_uid = ? AND user_uid = ?`,
    [boardUid, accessUserUid],
  )
  if (!total) {
    return 0
  }
  return total.count
}

// 기존에 특정 사용자가 업로드한 이미지들 불러오기
export async function loadUploadedImages(param: LoadImageParams): Promise<Pair[]> {
  let result: Pair[] = []
  if (param.lastUid < 1) {
    param.lastUid = param.maxUid + 1
  }
  const images = await select(
    `SELECT uid, path FROM ${table}image WHERE uid < ? AND board_uid = ? AND user_uid = ? 
  ORDER BY uid DESC LIMIT ?`,
    [param.lastUid, param.boardUid, param.accessUserUid, param.bunch],
  )

  for (const image of images) {
    result.push({ uid: image.uid, name: image.path })
  }
  return result
}

// 지정된 이미지 삭제하기
export async function removeUploadedImage(
  imageUid: number,
  accessUserUid: number,
): Promise<boolean> {
  const [image] = await select(`SELECT user_uid, path FROM ${table}image WHERE uid = ? LIMIT 1`, [
    imageUid,
  ])
  if (!image) {
    return false
  }
  if (accessUserUid !== image.user_uid) {
    return false
  }
  remove(`DELETE FROM ${table}image WHERE uid = ? LIMIT 1`, [imageUid])
  removeFile(`.${image.path}`)
  return true
}

// 태그 추천하기
export async function getSuggestionTags(hashtag: string, limit: number): Promise<Pair[]> {
  let result: Pair[] = []
  const tags = await select(
    `SELECT uid, name FROM ${table}hashtag WHERE name LIKE '%${hashtag}%' LIMIT ${limit}`,
  )
  if (!tags[0]) {
    return result
  }

  for (const tag of tags) {
    result.push({
      uid: tag.uid,
      name: tag.name,
    })
  }
  return result
}

// 카테고리 목록 반환하기
export async function getCategories(boardUid: number): Promise<Pair[]> {
  let result: Pair[] = []
  const cats = await select(`SELECT uid, name FROM ${table}board_category WHERE board_uid = ?`, [
    boardUid,
  ])
  if (!cats[0]) {
    return result
  }

  for (const cat of cats) {
    result.push({
      uid: cat.uid,
      name: cat.name,
    })
  }
  return result
}