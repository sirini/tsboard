/**
 * server/database/board/editor
 *
 * 글작성용 에디터와 관련된 처리
 */

import { table, insert } from "../common"
import { UploadImageParams } from "../../../src/interface/board"
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
    const minImageSize = Math.min(parseInt(process.env.IMAGE_SIZE || "800"), param.sizeLimit)

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
