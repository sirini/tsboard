/**
 * server/database/auth/signin
 *
 * 사용자 로그인 처리에 필요한 함수들
 */

import { table, select, update, insert } from "../common"
import { User } from "../../../src/interface/auth"
import { INIT_USER } from "./const"
import { SHA256 } from "crypto-js"
import { generateRandomID, makeSavePath } from "../../util/tools"
import sharp from "sharp"
import { NEW_MEMBER, SIZE } from "../../../tsboard.config"

// 사용자 로그인 시 아이디 비번 확인 및 사용자 정보 반환
export async function userSignIn(id: string, password: string): Promise<User> {
  let result: User = INIT_USER

  const [user] = await select(
    `SELECT uid, id, name, profile, level, point, signature, signup 
      FROM ${table}user 
      WHERE blocked = 0 AND id = ? AND password = ? LIMIT 1`,
    [id, password],
  )
  if (!user) {
    return result
  }

  const signin = Date.now()
  result = {
    uid: user.uid,
    id: user.id,
    name: user.name,
    profile: user.profile,
    level: user.level,
    point: user.point,
    signature: user.signature,
    signup: user.signup,
    signin,
    admin: false,
    token: "",
  }

  await update(
    `UPDATE ${table}user 
      SET signin = ?
      WHERE uid = ? LIMIT 1`,
    [signin, user.uid],
  )
  return result
}

// 구글 프로필 이미지 받아서 저장하기
async function saveGoogleProfile(pictureUri: string): Promise<string> {
  try {
    const response = await fetch(pictureUri)
    if (response.ok === false) {
      return ""
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const savePath = await makeSavePath("profile")
    const newSavePath = `${savePath}/${generateRandomID()}.avif`

    await sharp(buffer).resize({ width: SIZE.PROFILE }).toFormat("avif").toFile(newSavePath)

    return newSavePath
  } catch (e) {
    console.log(`[signin/saveGoogleProfile] ${e}`)
  }
  return ""
}

// OAuth 로그인 시 등록이 안되었으면 등록하고, 이미 등록되었다면 고유 번호 반환
export async function registerUser(id: string, name: string, pictureUri: string): Promise<number> {
  let userUid = 0
  const [user] = await select(`SELECT uid, profile FROM ${table}user WHERE id = ? LIMIT 1`, [id])

  if (!user) {
    const profile = await saveGoogleProfile(pictureUri)
    userUid = await insert(
      `INSERT INTO ${table}user (id, name, password, profile, level, point, signature, signup, signin, blocked) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        SHA256(generateRandomID()).toString(),
        profile.slice(1),
        NEW_MEMBER.LEVEL.toString(),
        NEW_MEMBER.POINT.toString(),
        "",
        Date.now().toString(),
        "0",
        "0",
      ],
    )
  } else {
    userUid = user.uid
    if (user.profile.length < 1 && pictureUri.length > 0) {
      const profile = await saveGoogleProfile(pictureUri)
      await update(`UPDATE ${table}user SET profile = ? WHERE uid = ? LIMIT 1`, [
        profile.slice(1),
        user.uid,
      ])
    }
  }

  return userUid
}
