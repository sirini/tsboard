/**
 * server/database/admin/user/modify
 *
 * 사용자 정보 수정하기와 관련된 처리
 */

import { AdminUserModifyParams } from "../../../../src/interface/admin"
import { UserModifyResult } from "../../../../src/interface/auth"
import {
  generateDate,
  generateRandomID,
  makeDirectory,
  removeFile,
  saveUploadedFile,
} from "../../../util/tools"
import { table, select, update } from "../../common"
import { mkdir, exists } from "node:fs/promises"
import sharp from "sharp"

// 기존 회원 정보 가져오기
export async function getUserInfo(userUid: number): Promise<UserModifyResult> {
  let result: UserModifyResult = {
    uid: 0,
    id: "",
    name: "",
    profile: "",
    level: 0,
    point: 0,
    signature: "",
  }
  const [user] = await select(
    `SELECT id, name, profile, level, point, signature FROM ${table}user WHERE uid = ? LIMIT 1`,
    [userUid],
  )
  if (!user) {
    return result
  }
  result = {
    uid: userUid,
    id: user.id,
    name: user.name,
    profile: user.profile,
    level: user.level,
    point: user.point,
    signature: user.signature,
  }
  return result
}

// 프로필 사진 저장 경로 만들기
async function makeSavePath(): Promise<string> {
  const date = generateDate()
  const savePath = `./upload/profile/${date.year}/${date.month}/${date.day}`
  await makeDirectory(savePath)
  return savePath
}

// 기존 프로필이 있을 경우 삭제하기
async function removeOldProfile(userUid: number): Promise<void> {
  const [old] = await select(`SELECT profile FROM ${table}user WHERE uid = ? LIMIT 1`, [userUid])
  if (!old) {
    return
  }
  if (old.profile === "") {
    return
  }
  const oldProfile = `.${old.profile}`
  removeFile(oldProfile)
}

// 새 프로필 사진이 있을 경우 업데이트
async function updateUserProfile(userUid: number, newProfile: File): Promise<string> {
  removeOldProfile(userUid)
  const savePath = await makeSavePath()
  let newSavePath = `${savePath}/${generateRandomID()}.webp`
  const tempFilePath = await saveUploadedFile(newProfile, `./upload/temp/profile`)
  const profileSize = parseInt(process.env.PROFILE_SIZE || "256")

  await sharp(tempFilePath)
    .resize(profileSize, profileSize)
    .rotate()
    .withMetadata()
    .toFormat("webp")
    .toFile(newSavePath)

  removeFile(tempFilePath)

  if ((await exists(newSavePath)) === false) {
    return ""
  }
  return newSavePath
}

// 프로필 내용 수정하기
export async function modifyUserInfo(param: AdminUserModifyParams): Promise<void> {
  if (param.password.length === 64) {
    await update(`UPDATE ${table}user SET password = ? WHERE uid = ? LIMIT 1`, [
      param.password,
      param.userUid,
    ])
  }

  let pathForProfile = ""
  if (param.profile !== undefined) {
    const newProfilePath = await updateUserProfile(param.userUid, param.profile)
    if (newProfilePath.length > 0) {
      pathForProfile = newProfilePath.slice(1)
      await update(`UPDATE ${table}user SET profile = '${pathForProfile}' WHERE uid = ? LIMIT 1`, [
        param.userUid,
      ])
    }
  }

  await update(
    `UPDATE ${table}user SET name = '${Bun.escapeHTML(param.name)}', level = ${
      param.level
    }, point = ${param.point}, signature = '${Bun.escapeHTML(
      param.signature,
    )}' WHERE uid = ? LIMIT 1`,
    [param.userUid],
  )
}
