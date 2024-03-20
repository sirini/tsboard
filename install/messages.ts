/**
 * install/welcome.ts
 *
 * 설치 실행 시 보여줄 메시지들 모음, 콘솔 화면에 출력을 위해 chalk 사용
 */
import chalk from "chalk"

export const env = `#
# TSBOARD 서버쪽 설정 파일
# 클라이언트쪽 설정은 vite.config.ts 참조
# 
# 참조1 - 서버쪽 mysqld.sock 파일 경로는 시스템마다 상이하므로 따로 확인 필요 (DB_SOCK_PATH)
# 참조2 - 메일 자동 발송을 위해 구글 메일 계정 필요하며, 맨 아래 참고) 부분을 꼭 따라해야 함
#
# 하다가 어려움이 있을 땐? tsboard.dev 방문!
#

# 기본 설정들
SERVER_PORT=3100
MAX_FILE_SIZE=102476800
PROFILE_SIZE=256
IMAGE_SIZE=512

# 데이터베이스 세팅 (각 서버 설정에 맞게 변경 필요)
DB_HOST=#dbhost#
DB_USER=#dbuser#
DB_PASS=#dbpass#
DB_NAME=#dbname#
DB_TABLE_PREFIX=#dbprefix#

# JWT 설정
JWT_ACCESS_TIMEOUT=30   # min
JWT_REFRESH_TIMEOUT=14  # day
JWT_SECRET_KEY=#jwtsecret#

# 관리자 아이디(이메일) 및 비밀번호
ADMIN_ID=#adminid#
ADMIN_PW=#adminpw#

# 쿠키 설정
COOKIE_HTTP_ONLY=true
COOKIE_SECURE=false

# 웹사이트 정보 설정 (메일 발송 시 링크 생성 등에 활용)
SITE_NAME=tsboard.dev
SITE_URL=https://tsboard.dev
SITE_TSBOARD_PATH=/

# 구글 앱비밀번호 for GMAIL 발송
# 참고) https://velog.io/@seul06/nodemailer
GMAIL_ID=yourgmailaddress@gmail.com
GMAIL_APP_PASSWORD=

# 게시판 기본 생성 시 초기값 지정
BOARD_ADMIN=1
BOARD_TYPE=0  # 0 = 게시판 / 1 = 갤러리 / 2 = 블로그(TBD)
BOARD_NAME=please_update_name
BOARD_INFO=please_update_info
BOARD_ROW=20
BOARD_WIDTH=1000
BOARD_USE_CATEGORY=1
BOARD_LEVEL_LIST=0
BOARD_LEVEL_VIEW=0
BOARD_LEVEL_WRITE=1
BOARD_LEVEL_COMMENT=1
BOARD_LEVEL_DOWNLOAD=1
BOARD_POINT_VIEW=0
BOARD_POINT_WRITE=10
BOARD_POINT_COMMENT=5
BOARD_POINT_DOWNLOAD=-10

# 회원 가입 시 초기값
NEW_MEMBER_LEVEL=1
NEW_MEMBER_POINT=100
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

v0.8.0 | tsboard.dev | ${chalk.gray("Currently only available in Korean.")}

✓ TSBOARD 설치 화면에 오신 것을 환영합니다!
  이 프로그램 설치를 위해 아래 Github 페이지에서 
  설치와 관련된 도움말을 확인 하실 수 있습니다.

  ${chalk.bgBlack.bold("https://github.com/sirini/tsboard")}

  도움이 필요할 땐 언제든지 ${chalk.yellow.bold("tsboard.dev")} 에 와주세요!

✓ 추가로, 설치 후에 아래 항목들도 꼭 ${chalk.yellow.bold(".env")} 파일에서 수정해 주세요!

  ${chalk.gray("GMAIL_ID")}
  ${chalk.gray("GMAIL_APP_PASSWORD")}
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

혹은, 도움이 필요할땐 언제든지 ${chalk.yellow.bold("tsboard.dev")} 에 방문해 주세요!\n
`
