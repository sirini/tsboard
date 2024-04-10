/**
 * server/database/admin/user/modify
 *
 * 사용자 정보 수정하기와 관련된 처리
 */

import { AdminUserModifyParams } from "../../../../src/interface/admin"
import { UserModifyResult } from "../../../../src/interface/auth"
import {
  generateRandomID,
  makeSavePath,
  removeFile,
  resizeImage,
  saveUploadedFile,
} from "../../../util/tools"
import { table, select, update } from "../../common"
import { exists } from "node:fs/promises"
import { SIZE } from "../../../../tsboard.config"

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
  const savePath = await makeSavePath("profile")
  const newSavePath = `${savePath}/${generateRandomID()}.avif`
  const tempFilePath = await saveUploadedFile(newProfile, `./upload/temp/profile`)

  await resizeImage(tempFilePath, newSavePath, SIZE.PROFILE)
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

  if (param.profile !== undefined) {
    const newProfilePath = await updateUserProfile(param.userUid, param.profile)
    if (newProfilePath.length > 0) {
      await update(
        `UPDATE ${table}user SET profile = '${newProfilePath.slice(1)}' WHERE uid = ? LIMIT 1`,
        [param.userUid],
      )
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
