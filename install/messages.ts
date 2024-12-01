/**
 * install/welcome.ts
 *
 * 설치 실행 시 보여줄 메시지들 모음, 콘솔 화면에 출력을 위해 chalk 사용
 */
import chalk from "chalk"
import { TSBOARD } from "../tsboard.config"

export const env = `#
# TSBOARD 서버쪽 설정 파일
#

# 백엔드 서버
GOAPI_VERSION=1.0.0-beta1
GOAPI_PORT=3003
GOAPI_URL=https://tsboard.dev
GOAPI_TITLE=TSBOARD

GOAPI_PROFILE_SIZE=256
GOAPI_CONTENT_INSERT_SIZE=640
GOAPI_THUMBNAIL_SIZE=512
GOAPI_FULL_SIZE=2400
GOAPI_FILE_SIZE_LIMIT=104857600

# 데이터베이스 세팅 (DB_UNIX_SOCKET 경로를 모를 경우 공란 유지)
DB_HOST=#dbhost#
DB_USER=#dbuser#
DB_PASS=#dbpass#
DB_NAME=#dbname#
DB_TABLE_PREFIX=#dbprefix#
DB_UNIX_SOCKET=#dbsock#
DB_MAX_IDLE=10
DB_MAX_OPEN=10

# JWT 설정
JWT_SECRET_KEY=#jwtsecret#

# 관리자 아이디(이메일) 및 비밀번호
ADMIN_ID=#adminid#
ADMIN_PW=#adminpw#

# 구글 앱비밀번호 for GMAIL 발송
# 참고) https://velog.io/@seul06/nodemailer
GMAIL_ID=
GMAIL_APP_PASSWORD=

# 구글 OAuth 클라이언트 (없다면 공란 유지)
OAUTH_GOOGLE_CLIENT_ID=
OAUTH_GOOGLE_SECRET=

# 네이버 OAuth 클라이언트 (없다면 공란 유지)
OAUTH_NAVER_CLIENT_ID=
OAUTH_NAVER_SECRET=

# 카카오 OAuth 클라이언트 (없다면 공란 유지)
OAUTH_KAKAO_CLIENT_ID=
OAUTH_KAKAO_SECRET=

# OpenAI API Key (없다면 공란 유지)
OPENAI_API_KEY=
`

const foundEnvTitle = `
 __                       _                    
/ _|                     | |                   
| |_ ___  _   _ _ __   __| |    ___ _ ____   __
|  _/ _ \\| | | | '_ \\ / _\` |   / _ \\ '_ \\ \\ / /
| || (_) | |_| | | | | (_| |  |  __/ | | \\ V / 
|_| \\___/ \\__,_|_| |_|\\__,_| (_)___|_| |_|\\_/  `
export const foundEnv = chalk.red.bold(foundEnvTitle)

const welcomeTitle = `
 _       _                         _ 
| |_ ___| |__   ___   __ _ _ __ __| |
| __/ __| '_ \\ / _ \\ / _\` | '__/ _\` |
| |_\\__ \\ |_) | (_) | (_| | | | (_| |
 \\__|___/_.__/ \\___/ \\__,_|_|  \\__,_|`
export const welcome = `${chalk.cyan.bold(welcomeTitle)}

${TSBOARD.VERSION} | tsboard.dev

✓ TSBOARD 설치 화면에 오신 것을 환영합니다!
  이 프로그램 설치를 위해 아래 Github 페이지에서 
  설치와 관련된 도움말을 확인 하실 수 있습니다.

  ${chalk.bgBlack.bold("https://github.com/sirini/tsboard")}

  도움이 필요할 땐 언제든지 ${chalk.yellow.bold("tsboard.dev")} 에 와주세요!

✓ 추가로, 설치 후에 아래 항목들도 꼭 ${chalk.yellow.bold(".env")} 파일에서 수정해 주세요!

  ${chalk.gray("GMAIL_ID")}
  ${chalk.gray("GMAIL_APP_PASSWORD")}
  ${chalk.gray("OAUTH_GOOGLE_SECRET")}
`

const installTitle = `
 _           _        _ _       
(_)         | |      | | |      
 _ _ __  ___| |_ __ _| | |      
| | '_ \\/ __| __/ _\` | | |      
| | | | \\__ \\ || (_| | | |_ _ _ 
|_|_| |_|___/\\__\\__,_|_|_(_|_|_)`
export const install = `${chalk.gray.bold(installTitle)}

${chalk.yellow.bold(".env")} 파일에 입력해주신 MySQL(Maria) DBMS 정보를 저장하고
데이터베이스 및 테이블들을 추가합니다...
`

const completeTitle = `
     _                       ___  
    | |                     |__ \\ 
  __| | ___  _ __   ___        ) |
 / _\` |/ _ \\| '_ \\ / _ \\      / / 
| (_| | (_) | | | |  __/_ _ _|_|  
 \\__,_|\\___/|_| |_|\\___(_|_|_|_)  `
export const complete = `${chalk.green.bold(completeTitle)}

축하합니다!\n
입력해주신 내용들을 참조하여 #dbname# 데이터베이스 및 
#dbprefix# 로 시작하는 여러 테이블들을 생성하였습니다.

${chalk.bold("이제 거의 다 왔습니다.")}\n
아래 페이지에서 설치 마무리 및 TSBOARD 실행 관련 내용을 확인해 주세요!

${chalk.bgBlack.bold("https://github.com/sirini/tsboard")}

혹은, 도움이 필요할땐 언제든지 ${chalk.yellow.bold("tsboard.dev")} 에 방문해 주세요!
`
