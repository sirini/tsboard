/**
 * server/database/board/editor
 *
 * 글작성용 에디터와 관련된 처리
 */

import { table, insert, select, remove, update } from "../common"
import { CONTENT_STATUS, CountPair, Pair, TargetTable } from "../../../src/interface/board"
import {
  UploadImageParams,
  WritePostParams,
  LoadImageParams,
  ModifyPostParams,
} from "../../../src/interface/editor"
import {
  generateRandomID,
  makeSavePath,
  removeFile,
  resizeImage,
  saveUploadedFile,
} from "../../util/tools"
import { exists } from "node:fs/promises"
import { TSBOARD } from "../../../tsboard.config"

// 글작성 레벨 제한 가져오기
export async function getWriteLevel(boardUid: number): Promise<number> {
  const [board] = await select(`SELECT level_write FROM ${table}board WHERE uid = ? LIMIT 1`, [
    boardUid,
  ])
  if (!board) {
    return 0
  }
  return board.level_write
}

// 글작성 포인트 가져오기
export async function getWritePoint(boardUid: number): Promise<number> {
  const [board] = await select(`SELECT point_write FROM ${table}board WHERE uid = ? LIMIT 1`, [
    boardUid,
  ])
  if (!board) {
    return 0
  }
  return board.point_write
}

// 본문 내 삽입용 이미지 업로드
export async function uploadImages(param: UploadImageParams): Promise<string[]> {
  let result: string[] = []
  const savePath = await makeSavePath("images")

  for (const image of param.images) {
    const newSavePath = `${savePath}/${generateRandomID()}.webp`
    const tempFilePath = await saveUploadedFile(image, `./upload/temp/images`)
    const minImageSize = TSBOARD.IMAGE.CONTENT_INSERT_SIZE

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
export async function getSuggestionTags(hashtag: string, limit: number): Promise<CountPair[]> {
  let result: CountPair[] = []
  const tags = await select(
    `SELECT uid, name, used FROM ${table}hashtag WHERE name LIKE '%${hashtag}%' LIMIT ${limit}`,
  )
  if (!tags[0]) {
    return result
  }

  for (const tag of tags) {
    result.push({
      uid: tag.uid,
      name: tag.name,
      count: tag.used,
    })
  }
  return result
}

// 입력받은 태그들 저장하기
export async function saveTags(boardUid: number, postUid: number, tags: string[]): Promise<void> {
  for (const tag of tags) {
    let hashtagUid = 0
    const [exist] = await select(`SELECT uid FROM ${table}hashtag WHERE name = ? LIMIT 1`, [tag])
    if (exist) {
      hashtagUid = exist.uid
      await update(`UPDATE ${table}hashtag SET used = used + 1 WHERE uid = ? LIMIT 1`, [hashtagUid])
    } else {
      hashtagUid = await insert(
        `INSERT INTO ${table}hashtag (name, used, timestamp) VALUES (?, ?, ?)`,
        [tag, 1, Date.now()],
      )
    }
    insert(`INSERT INTO ${table}post_hashtag (board_uid, post_uid, hashtag_uid) VALUES (?, ?, ?)`, [
      boardUid,
      postUid,
      hashtagUid,
    ])
  }
}

// 입력받은 첨부파일들을 저장하기
export async function saveAttachments(
  boardUid: number,
  postUid: number,
  files: File[],
): Promise<void> {
  const savePath = await makeSavePath("attachments")
  for (const file of files) {
    const ext = file.name.split(".").pop() || ""
    const newSavePath = `${savePath}/${generateRandomID()}.${ext}`
    await Bun.write(newSavePath, file)

    if ((await exists(newSavePath)) === true) {
      const pathForAttachment = newSavePath.slice(1)
      insert(
        `INSERT INTO ${table}file (board_uid, post_uid, name, path, timestamp) VALUES (?, ?, ?, ?, ?)`,
        [boardUid, postUid, file.name, pathForAttachment, Date.now()],
      )
    }
  }
}

// 새 게시글 작성하기
export async function writeNewPost(param: WritePostParams): Promise<number> {
  const insertId = await insert(
    `INSERT INTO ${table}post 
  (board_uid, user_uid, category_uid, title, content, submitted, modified, hit, status) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      param.boardUid,
      param.accessUserUid,
      param.categoryUid,
      param.title,
      param.content,
      Date.now(),
      0,
      0,
      param.isNoticePost ? CONTENT_STATUS.NOTICE : CONTENT_STATUS.NORMAL,
    ],
  )
  return insertId
}

// 기존 게시글 수정하기
export async function modifyOriginalPost(param: ModifyPostParams): Promise<void> {
  await update(
    `UPDATE ${table}post SET category_uid = ?, title = ?, content = ?, modified = ?, status = ? WHERE uid = ? LIMIT 1`,
    [
      param.categoryUid,
      param.title,
      param.content,
      Date.now(),
      param.isNoticePost ? CONTENT_STATUS.NOTICE : CONTENT_STATUS.NORMAL,
      param.postUid,
    ],
  )
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

// 작성자인지 확인하기
export async function isAuthor(
  targetUid: number,
  accessUserUid: number,
  target: TargetTable,
): Promise<boolean> {
  const [content] = await select(`SELECT user_uid FROM ${table}${target} WHERE uid = ? LIMIT 1`, [
    targetUid,
  ])
  if (!content) {
    return false
  }
  return content.user_uid === accessUserUid
}

// 첨부되어 있던 파일 삭제
export async function removeAttachedFile(fileUid: number): Promise<void> {
  const [file] = await select(`SELECT path FROM ${table}file WHERE uid = ? LIMIT 1`, [fileUid])
  if (!file) {
    return
  }
  removeFile(`.${file.path}`)
  remove(`DELETE FROM ${table}file WHERE uid = ? LIMIT 1`, [fileUid])
}

// 기존에 등록했던 태그들 제거 (글수정 시)
export async function removeOriginalTags(postUid: number): Promise<void> {
  const tags = await select(`SELECT hashtag_uid FROM ${table}post_hashtag WHERE post_uid = ?`, [
    postUid,
  ])
  for (const tag of tags) {
    update(`UPDATE ${table}hashtag SET used = used - 1 WHERE uid = ? LIMIT 1`, [tag.hashtag_uid])
  }
  remove(`DELETE FROM ${table}post_hashtag WHERE post_uid = ?`, [postUid])
}
