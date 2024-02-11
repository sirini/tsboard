/**
 * server/database/admin/user/modify
 *
 * 사용자 정보 수정하기와 관련된 처리
 */

import { UserModifyResult } from "../../../../src/interface/auth"
import { table, select, update } from "../../common"
import { mkdir, unlink } from "node:fs/promises"
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

// 새 패스워드가 있을 경우 업데이트
export async function updateUserPassword(
  userUid: number,
  newPassword: string | undefined,
): Promise<void> {
  if (newPassword === undefined) {
    return
  }
  await update(`UPDATE ${table}user SET password = ? WHERE uid = ? LIMIT 1`, [newPassword, userUid])
}

// 프로필 사진 저장 경로 만들기
function makeSavePath(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = ("0" + (date.getMonth() + 1)).slice(-2)
  const day = ("0" + date.getDate()).slice(-2)
  return `./upload/profile/${year}/${month}/${day}`
}

// 기존 프로필이 있을 경우 삭제하기
async function removeOldProfile(userUid: number): Promise<void> {
  const [old] = await select(`SELECT profile FROM ${table}user WHERE uid = ? LIMIT 1`, [userUid])
  if (!old) {
    return
  }
  const oldProfile = `.${old.profile}`
  const f = Bun.file(oldProfile)
  if ((await f.exists()) === true) {
    unlink(oldProfile)
  }
}

// 새 프로필 사진이 있을 경우 업데이트
export async function updateUserProfile(
  userUid: number,
  newProfile: File | undefined,
): Promise<string> {
  if (newProfile === undefined) {
    return ""
  }
  removeOldProfile(userUid)
  let newSavePath = `${makeSavePath()}/${userUid}.webp`
  // TODO
  return newSavePath
}
