/**
 * tsboard.config
 *
 * TSBOARD 기본 설정 파일
 */

export const IS_DEV = true // 개발중일 때 true 로 설정 후 저장, 프로덕션에서는 false
export const PORT_DEV_VITE = 3000
export const PORT_DEV = 3200
export const PORT_PROD = 3100
export const LOCALHOST = "http://localhost" // 개발중일때는 localhost 혹은 본인 도메인 설정
const DEV_URL = `${LOCALHOST}:${PORT_DEV_VITE}`
const PROD_URL = "https://tsboard.dev" /*** 수정 필요 ***/

export const TSBOARD = {
  VERSION: "v0.9.10",
  SITE: {
    NAME: "TSBOARD" /*** 수정 필요 ***/,
    TITLE: "TSBOARD | Type Safety Community Builder" /*** 수정 필요 ***/,
    API_PORT: IS_DEV ? PORT_DEV : PORT_PROD,
  },
  PREFIX: "" /*** TSBOARD 설치 경로가 root 가 아닐 경우 앞쪽 경로 작성, 예: "/tsboard" */,
  API: {
    URI: IS_DEV
      ? DEV_URL
      : PROD_URL /* 쿠키가 제대로 동작하려면, API 호출은 3000(개발 시) 혹은 80(프로덕션 시) */,
  },
}

export const SEO = {
  LIMIT: {
    POST: 50 /* 검색엔진용 페이지에 보여줄 최근 게시글 갯수, 많을수록 페이지 생성이 느려집니다 */,
    COMMENT: 20 /* 검색엔진용 페이지에 보여줄 게시글 별 최근 댓글 수, 많을수록 페이지 생성이 느려집니다 */,
  },
}

export const QUICK_BUTTONS = {
  WRITE: "free" /* (모바일) 글쓰기 버튼 클릭 시 이동할 게시판 아이디 */,
  UPLOAD: "photo" /* (모바일) 사진 업로드 버튼 클릭 시 이동할 갤러리 아이디 */,
}

export const AUTH = {
  JWT: {
    ACCESS_TIMEOUT: 30 /* minutes */,
    REFRESH_TIMEOUT: 14 /* day */,
    OAUTH_TIMEOUT: 10 /* minutes */,
  },
  COOKIE: {
    HTTP_ONLY: true,
    SECURE: false,
  },
}

export const SIZE = {
  PROFILE: 256 /* px */,
  CONTENT_INSERT: 640 /* px */,
  THUMBNAIL: 512 /* px */,
  FULL: 2400 /* px, for gallery */,
  MAX_FILE: 104857600 /* bytes, nginx 웹서버의 경우 client_max_body_size 값과 같거나 작아야 함 */,
}

export const OAUTH = {
  IS_READY: true,
  USE: {
    GOOGLE: true,
    NAVER: true,
    KAKAO: true,
  },
}

export const NEW_BOARD = {
  ADMIN: 1 /* admin user uid */,
  TYPE: 0 /* 0: 게시판, 1: 갤러리, 2: 블로그, 3: 쇼핑몰 */,
  NAME: "새로운 게시판",
  INFO: "새 게시판 설명",
  ROWS: 20,
  WIDTH: 1000,
  USE_CATEGORY: 1,
  LEVEL: {
    LIST: 0,
    VIEW: 0,
    WRITE: 1,
    COMMENT: 1,
    DOWNLOAD: 1,
  },
  POINT: {
    VIEW: 0,
    WRITE: 5,
    COMMENT: 2,
    DOWNLOAD: -10,
  },
}

export const NEW_MEMBER = {
  LEVEL: 1,
  POINT: 100,
}

export const SCREEN = {
  MOBILE: { WIDTH: 480, COLS: 12 },
  TABLET: { WIDTH: 768, COLS: 6 },
  PC: { WIDTH: 1024, COLS: 4 },
  LARGE: { WIDTH: 1440, COLS: 3 },
}

export const POLICY = {
  NAME: "sirini" /* 사이트 관리자 성함 */,
  EMAIL: "sirini@gmail.com" /* 관리자 이메일 */,
}

Object.freeze(TSBOARD)
Object.freeze(SEO)
Object.freeze(QUICK_BUTTONS)
Object.freeze(AUTH)
Object.freeze(SIZE)
Object.freeze(OAUTH)
Object.freeze(NEW_BOARD)
Object.freeze(NEW_MEMBER)
Object.freeze(SCREEN)
Object.freeze(POLICY)
