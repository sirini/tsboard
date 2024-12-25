export const IS_DEV = true // 프로덕션에서는 false, 개발 단계에서만 true
export const VITE_PORT = 3000
export const API_PORT = 3003
export const LOCALHOST = "http://localhost" // (개발용) localhost 혹은 개발중인 머신의 (IP)주소
const DEV_URL = `${LOCALHOST}:${VITE_PORT}`
const PROD_URL = "https://tsboard.dev" // <<< [수정 필요] 본인 사이트의 도메인 입력

export const TSBOARD = {
  SITE: {
    NAME: "TSBOARD" /* <<< [수정 필요] 본인 사이트 이름 입력 */,
    URL: IS_DEV ? DEV_URL : PROD_URL,
  },
  PREFIX: "" /* <<< [수정 필요] 설치 경로가 root 가 아닐 시 수정, 예: "/tsboard" */,
  API: (IS_DEV ? DEV_URL : PROD_URL) + "/goapi",
}

export const QUICK_BUTTONS = {
  WRITE: "free" /* <<< [수정 필요] (모바일) 글쓰기 버튼 클릭 시 이동할 게시판 아이디 */,
  UPLOAD: "photo" /* <<< [수정 필요] (모바일) 사진 업로드 버튼 클릭 시 이동할 갤러리 아이디 */,
}

// .env 파일과 동일하게 설정되어야 함
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

export const SCREEN = {
  MOBILE: { WIDTH: 480, COLS: 12 },
  TABLET: { WIDTH: 768, COLS: 6 },
  PC: { WIDTH: 1024, COLS: 4 },
  LARGE: { WIDTH: 1440, COLS: 3 },
}

export const POLICY = {
  NAME: "sirini" /* <<< [수정 필요] 사이트 관리자 성함 */,
  EMAIL: "sirini@gmail.com" /* <<< [수정 필요] 관리자 이메일 */,
}

Object.freeze(TSBOARD)
Object.freeze(QUICK_BUTTONS)
Object.freeze(SIZE)
Object.freeze(OAUTH)
Object.freeze(SCREEN)
Object.freeze(POLICY)
