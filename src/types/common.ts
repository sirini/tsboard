export type Code = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
export type ErrorCode = Exclude<Code, 0>

export type Resp<T> =
  | { success: true; error: ""; code: 0; result: T }
  | { success: false; error: string; code: ErrorCode; result: null }

export const CODE = {
  SUCCESS: 0,
  NOT_ADMIN: 1,
  INVALID_TOKEN: 2,
  INVALID_PARAM: 3,
  FAILED_OPERATION: 4,
  DUPLICATED_VALUE: 5,
  NO_PERMISSION: 6,
  EXCEED_SIZE: 7,
  EXPIRED: 8,
  MAIL_NOT_CONFIGURED: 9,
  RATE_LIMITED: 10,
  SIGNUP_DISABLED: 11,
  INVALID_INVITE: 12,
} as const satisfies Record<string, Code>

export type Pair = { uid: number; name: string }

export const SEARCH = {
  TITLE: 0,
  CONTENT: 1,
  WRITER: 2,
  TAG: 3,
  CATEGORY: 4,
  REPORT_TO: 5,
  REPORT_FROM: 6,
  REPORT_REQUEST: 7,
  REPORT_RESPONSE: 8,
  USER_NAME: 9,
  USER_ID: 10,
  USER_LEVEL: 11,
  IMAGE_DESCRIPTION: 12,
  NONE: 13,
} as const

export type Search = (typeof SEARCH)[keyof typeof SEARCH]
