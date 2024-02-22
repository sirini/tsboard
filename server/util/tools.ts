/**
 * server/util/tools
 *
 * 서버단에서 활용할 함수들 정의
 */

import { unlinkSync } from "node:fs"
import { JWTPayloadSpec } from "@elysiajs/jwt"
import { Token } from "../../src/interface/auth"
import { saveTokens } from "../database/auth/authorization"
import { exists, mkdir } from "node:fs/promises"
import { nanoid, customAlphabet } from "nanoid"
import sharp from "sharp"

// 랜덤 문자 6개 반환하는 함수, 인증 코드로 활용한다
export function generateRandomCode() {
  const customId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz")
  return customId(6)
}

// 랜덤한 문자열 반환
export function generateRandomID(): string {
  return nanoid()
}

interface Date {
  year: string
  month: string
  day: string
  hour: string
  minute: string
  second: string
}

// 현재 시간을 연월일시분초 형태 객체로 반환
export function generateDate(): Date {
  const date = new Date()
  const result: Date = {
    year: date.getFullYear().toString(),
    month: ("0" + (date.getMonth() + 1)).slice(-2),
    day: ("0" + date.getDate()).slice(-2),
    hour: ("0" + date.getHours()).slice(-2),
    minute: ("0" + date.getMinutes()).slice(-2),
    second: ("0" + date.getSeconds()).slice(-2),
  }
  return result
}

interface Result<T> {
  success: boolean
  error: string
  result: T
}

// Elysia 실패 메시지 리턴
export function fail<T>(error: string, result: T): Result<T> {
  return {
    success: false,
    error,
    result,
  }
}

// Elysia 성공 메시지 리턴
export function success<T>(result: T): Result<T> {
  return {
    success: true,
    error: "",
    result,
  }
}

// 액세스 토큰 [만료] & 리프레시 토큰 [유효] 때 액세스 토큰 업데이트 후 반환
export async function getUpdatedAccessToken(
  jwt: any,
  accessToken: string,
  refreshToken: string,
): Promise<string> {
  let newAccessToken = ""
  const access = (await jwt.verify(accessToken)) as
    | false
    | (Record<string, string | number> & JWTPayloadSpec)
  if (access === false) {
    return newAccessToken
  }
  const userUid = access.uid as number
  const accessTokenTime = access.signin as number
  const now = Date.now()

  if (accessTokenTime < now) {
    newAccessToken = await jwt.sign({
      uid: userUid,
      id: access.id,
      signin: Date.now(),
    })
    const token: Token = {
      access: newAccessToken,
      refresh: refreshToken,
    }
    saveTokens(userUid, token)
  }
  return newAccessToken
}

// 주어진 파일 경로가 유효한지 확인하고 삭제하기
export async function removeFile(path: string): Promise<boolean> {
  const filepath = Bun.file(path)
  if ((await filepath.exists()) === true) {
    unlinkSync(path)
    return true
  }
  return false
}

// 업로드된 파일을 임시 경로에 잠깐 저장하기
export async function saveUploadedFile(file: File, dirPath: string): Promise<string> {
  await makeDirectory(dirPath)
  const savedPath = `${dirPath}/${file.name}`
  await Bun.write(savedPath, file)
  return savedPath
}

// 주어진 폴더 경로를 생성하기
export async function makeDirectory(recursivePath: string): Promise<void> {
  if ((await exists(recursivePath)) === false) {
    await mkdir(recursivePath, { recursive: true })
  }
}

// 파일 저장 경로 만들기
export async function makeSavePath(target: string): Promise<string> {
  const date = generateDate()
  const savePath = `./upload/${target}/${date.year}/${date.month}/${date.day}`
  await makeDirectory(savePath)
  return savePath
}

// 이미지 리사이즈하기
export async function resizeImage(
  inputPath: string,
  outputPath: string,
  size: number,
): Promise<void> {
  await sharp(inputPath)
    .resize(size, size)
    .rotate()
    .withMetadata()
    .toFormat("webp")
    .toFile(outputPath)
}
