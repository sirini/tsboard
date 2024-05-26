/**
 * server/database/board/editor
 *
 * 글작성용 에디터와 관련된 처리
 */

import { table, insert, select, remove, update } from "../common"
import { CountPair, Pair, TargetTable } from "../../../src/interface/board"
import {
  UploadImageParams,
  WritePostParams,
  LoadImageParams,
  ModifyPostParams,
} from "../../../src/interface/editor"
import {
  generateRandomID,
  exif,
  makeSavePath,
  removeFile,
  resizeImage,
  saveUploadedFile,
} from "../../util/tools"
import { CONTENT_STATUS } from "./const"
import { exists } from "node:fs/promises"
import { SIZE, TSBOARD } from "../../../tsboard.config"
import OpenAI from "openai"
import sharp from "sharp"

// 글작성 레벨 제한 가져오기
export async function getWriteLevel(boardUid: number): Promise<number> {
  const [board] = await select(`SELECT level_write FROM ${table}board WHERE uid = ? LIMIT 1`, [
    boardUid.toString(),
  ])
  if (!board) {
    return 0
  }
  return board.level_write
}

// 글작성 포인트 가져오기
export async function getWritePoint(boardUid: number): Promise<number> {
  const [board] = await select(`SELECT point_write FROM ${table}board WHERE uid = ? LIMIT 1`, [
    boardUid.toString(),
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
    const newSavePath = `${savePath}/${generateRandomID()}.avif`
    const tempFilePath = await saveUploadedFile(image, `./upload/temp/images`)

    await resizeImage(tempFilePath, newSavePath, SIZE.CONTENT_INSERT)
    removeFile(tempFilePath)

    if ((await exists(newSavePath)) === true) {
      const pathForImage = newSavePath.slice(1)
      await insert(
        `INSERT INTO ${table}image (board_uid, user_uid, path, timestamp) VALUES 
      (?, ?, ?, ?)`,
        [
          param.boardUid.toString(),
          param.accessUserUid.toString(),
          pathForImage,
          Date.now().toString(),
        ],
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
    [boardUid.toString(), accessUserUid.toString()],
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
    [boardUid.toString(), accessUserUid.toString()],
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
    [
      param.lastUid.toString(),
      param.boardUid.toString(),
      param.accessUserUid.toString(),
      param.bunch.toString(),
    ],
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
  const imageUidQuery = imageUid.toString()
  const [image] = await select(`SELECT user_uid, path FROM ${table}image WHERE uid = ? LIMIT 1`, [
    imageUidQuery,
  ])
  if (!image) {
    return false
  }
  if (accessUserUid !== image.user_uid) {
    return false
  }
  remove(`DELETE FROM ${table}image WHERE uid = ? LIMIT 1`, [imageUidQuery])
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
      await update(`UPDATE ${table}hashtag SET used = used + 1 WHERE uid = ? LIMIT 1`, [
        hashtagUid.toString(),
      ])
    } else {
      hashtagUid = await insert(
        `INSERT INTO ${table}hashtag (name, used, timestamp) VALUES (?, ?, ?)`,
        [tag, "1", Date.now().toString()],
      )
    }
    insert(`INSERT INTO ${table}post_hashtag (board_uid, post_uid, hashtag_uid) VALUES (?, ?, ?)`, [
      boardUid.toString(),
      postUid.toString(),
      hashtagUid.toString(),
    ])
  }
}

// 첨부파일이 이미지 파일이면 썸네일도 생성하여 저장하기
export async function saveThumbnailImage(
  fileUid: number,
  postUid: number,
  inputFilePath: string,
): Promise<{ thumb: string; full: string }> {
  let result = {
    thumb: "",
    full: "",
  }
  const thumbPath = await makeSavePath("thumbnails")
  const thumbSavePath = `${thumbPath}/t${generateRandomID()}.avif`
  await resizeImage(inputFilePath, thumbSavePath, SIZE.THUMBNAIL)

  const fullSavePath = `${thumbPath}/f${generateRandomID()}.avif`
  await resizeImage(inputFilePath, fullSavePath, SIZE.FULL)

  result.thumb = thumbSavePath.slice(1)
  result.full = fullSavePath.slice(1)
  await insert(
    `INSERT INTO ${table}file_thumbnail (file_uid, post_uid, path, full_path) VALUES (?, ?, ?, ?)`,
    [fileUid.toString(), postUid.toString(), result.thumb, result.full],
  )

  return result
}

// 이미지 파일 첨부시 EXIF 정보도 추출해서 저장하기
export async function extractEXIF(
  fileUid: number,
  postUid: number,
  inputFilePath: string,
): Promise<void> {
  const result = await exif(inputFilePath)
  if (result.make.length < 1 && result.model.length < 1) {
    return
  }
  await insert(
    `INSERT INTO ${table}exif (file_uid, post_uid, make, model, aperture, iso, focal_length, exposure, width, height, date) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      fileUid.toString(),
      postUid.toString(),
      result.make,
      result.model,
      result.aperture.toString(),
      result.iso.toString(),
      result.focalLength.toString(),
      result.exposure.toString(),
      result.width.toString(),
      result.height.toString(),
      result.date.toString(),
    ],
  )
}

// OpenAI API를 이용하여 올려진 사진에 대한 설명 추가
export async function saveDescriptionForImage(
  fileUid: number,
  postUid: number,
  thumbnailPath: string,
): Promise<void> {
  if (process.env.OPENAI_API_KEY === undefined || process.env.OPENAI_API_KEY === "") {
    return
  }

  const outputPath = thumbnailPath.replace(".avif", ".jpg")
  await sharp(thumbnailPath, { failOn: "truncated" })
    .toFormat("jpg", {
      quality: 90,
    })
    .toFile(outputPath)

  if ((await exists(outputPath)) === false) {
    return
  }

  try {
    const url = `${TSBOARD.API.URI}${outputPath.slice(1)}`
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe the content of this image in Korean.",
            },
            {
              type: "image_url",
              image_url: {
                url,
                detail: "low",
              },
            },
          ],
        },
      ],
    })

    const description = response.choices[0].message.content || ""
    if (description.length > 0) {
      await insert(
        `INSERT INTO ${table}image_description (file_uid, post_uid, description) VALUES (?, ?, ?)`,
        [fileUid.toString(), postUid.toString(), description],
      )
    }
  } catch (e: any) {
    // do nothing
  } finally {
    await removeFile(`.${outputPath}`)
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
      const fileUid = await insert(
        `INSERT INTO ${table}file (board_uid, post_uid, name, path, timestamp) VALUES (?, ?, ?, ?, ?)`,
        [
          boardUid.toString(),
          postUid.toString(),
          file.name,
          newSavePath.slice(1),
          Date.now().toString(),
        ],
      )

      if (/(jpg|jpeg|png|bmp|webp|gif|avif)/i.test(ext) === true) {
        const image = await saveThumbnailImage(fileUid, postUid, newSavePath)
        await extractEXIF(fileUid, postUid, newSavePath)
        await saveDescriptionForImage(fileUid, postUid, `.${image.thumb}`)
      }
    }
  }
}

// 공지 or 비밀글 or 일반글 반환
function getPostStatus(isNotice: boolean, isSecret: boolean): string {
  return isNotice
    ? CONTENT_STATUS.NOTICE.toString()
    : isSecret
      ? CONTENT_STATUS.SECRET.toString()
      : CONTENT_STATUS.NORMAL.toString()
}

// 새 게시글 작성하기
export async function writeNewPost(param: WritePostParams): Promise<number> {
  const insertId = await insert(
    `INSERT INTO ${table}post 
  (board_uid, user_uid, category_uid, title, content, submitted, modified, hit, status) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      param.boardUid.toString(),
      param.accessUserUid.toString(),
      param.categoryUid.toString(),
      param.title,
      param.content,
      Date.now().toString(),
      "0",
      "0",
      getPostStatus(param.isNoticePost, param.isSecretPost),
    ],
  )
  return insertId
}

// 기존 게시글 수정하기
export async function modifyOriginalPost(param: ModifyPostParams): Promise<void> {
  await update(
    `UPDATE ${table}post SET category_uid = ?, title = ?, content = ?, modified = ?, status = ? WHERE uid = ? LIMIT 1`,
    [
      param.categoryUid.toString(),
      param.title,
      param.content,
      Date.now().toString(),
      getPostStatus(param.isNoticePost, param.isSecretPost),
      param.postUid.toString(),
    ],
  )
}

// 카테고리 목록 반환하기
export async function getCategories(boardUid: number): Promise<Pair[]> {
  let result: Pair[] = []
  const cats = await select(`SELECT uid, name FROM ${table}board_category WHERE board_uid = ?`, [
    boardUid.toString(),
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
    targetUid.toString(),
  ])
  if (!content) {
    return false
  }
  return content.user_uid === accessUserUid
}

// 첨부파일이 이미지라면 썸네일도 삭제하기
async function removeThumbnailFile(fileUid: number): Promise<void> {
  const [thumb] = await select(
    `SELECT uid, path, full_path FROM ${table}file_thumbnail WHERE file_uid = ? LIMIT 1`,
    [fileUid.toString()],
  )
  if (!thumb) {
    return
  }
  removeFile(`.${thumb.path}`)
  removeFile(`.${thumb.full_path}`)
  remove(`DELETE FROM ${table}file_thumbnail WHERE uid = ? LIMIT 1`, [thumb.uid])
}

// 첨부되어 있던 파일 삭제
export async function removeAttachedFile(fileUid: number): Promise<void> {
  const fileUidQuery = fileUid.toString()
  const [file] = await select(`SELECT path FROM ${table}file WHERE uid = ? LIMIT 1`, [fileUidQuery])
  if (!file) {
    return
  }
  if (/\.(jpg|jpeg|png|bmp|webp|gif|avif)$/i.test(file.path) === true) {
    removeThumbnailFile(fileUid)
  }

  removeFile(`.${file.path}`)
  remove(`DELETE FROM ${table}file WHERE uid = ? LIMIT 1`, [fileUidQuery])
}

// 기존에 등록했던 태그들 제거 (글수정 시)
export async function removeOriginalTags(postUid: number): Promise<void> {
  const postUidQuery = postUid.toString()
  const tags = await select(`SELECT hashtag_uid FROM ${table}post_hashtag WHERE post_uid = ?`, [
    postUidQuery,
  ])
  for (const tag of tags) {
    update(`UPDATE ${table}hashtag SET used = used - 1 WHERE uid = ? LIMIT 1`, [tag.hashtag_uid])
  }
  remove(`DELETE FROM ${table}post_hashtag WHERE post_uid = ?`, [postUidQuery])
}
