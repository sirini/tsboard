// 에러 코드 타입 정의
export type Code = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

// 서버 기본 응답 타입 정의
export type ResponseData<T> = {
  success: boolean
  error: string
  code: Code
  result: T
}

// 에러 코드 정의
export const CODE = {
  SUCCESS: 0,
  NOT_ADMIN: 1,
  INVALID_TOKEN: 2,
  INVALID_PARAMETER: 3,
  FAILED_OPERATION: 4,
  DUPLICATED_VALUE: 5,
  NO_PERMISSION: 6,
  EXCEED_SIZE: 7,
  EXPIRED: 8,
}
