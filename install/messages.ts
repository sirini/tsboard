/**
 * install/welcome.ts
 *
 * 설치 실행 시 보여줄 메시지들 모음
 */
export const env = `
#
# TSBOARD 서버쪽 설정 파일
# 클라이언트쪽 설정은 vite.config.ts > define > "process.env": {} 영역 참조
# 
# 참조1 - 서버쪽 mysqld.sock 파일 경로는 시스템마다 상이하므로 따로 확인 필요 (DB_SOCK_PROD)
# 참조2 - JWT 키는 반드시 그대로 두지 말고 수정해서 사용 필요 (JWT_SECRET_KEY)
# 참조3 - 메일 자동 발송을 위해 구글 메일 계정 필요하며, 맨 아래 참고) 부분을 꼭 따라해야 함
#
# 하다가 어려움이 있을 땐? tsboard.dev 방문!
# 
RELEASE=dev
SERVER_PORT=3100
MAX_FILE_SIZE=10247680

# 데이터베이스 세팅 (각 서버 설정에 맞게 변경 필요)
DB_HOST=localhost
DB_USER=dbusername
DB_PASS=dbpassword
DB_DATA=tsboard
DB_TABLE_PREFIX=tsb_
DB_SOCK_DEV=
DB_SOCK_PROD=/run/mysqld/mysqld.sock

# JWT 키 세팅 (외부에 노출되면 안되며, 특문 포함 어렵게 다시 수정해주세요)
JWT_SECRET_KEY=@$_-Ts_board_!JWT!_secret*-&key+

# GMAIL OAUTH
# 참고) https://iamiet.tistory.com/entry/Nodemailer-Gmail-OAuth20%EC%9C%BC%EB%A1%9C-%EC%9D%B4%EB%A9%94%EC%9D%BC-%EB%B0%9C%EC%86%A1%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0
GMAIL_OAUTH_USER= # Oauth Client에서 테스트 사용자로 등록된 이메일 주소
GMAIL_OAUTH_CLIENT_ID= # OAuth Client의 아이디
GAMIL_OAUTH_CLIENT_SECRET= # OAuth Client의 보안 비밀번호
GAMIL_OAUTH_REFRESH_TOKEN= # playground에서 발급받은 리프레쉬 토큰
`

export const welcome = `
 _       _                         _ 
| |_ ___| |__   ___   __ _ _ __ __| |
| __/ __| '_ \\ / _ \\ / _\` | '__/ _\` |
| |_\\__ \\ |_) | (_) | (_| | | | (_| |
 \\__|___/_.__/ \\___/ \\__,_|_|  \\__,_|

v0.8.0 | tsboard.dev | Currently only available in Korean.

✓ 이제 .env 파일이 생성되었습니다! .env 파일을 에디터로 열어 
  아래 내용을 수정하세요!
  • DB_HOST • DB_USER • DB_PASS • DB_DATA • DB_SOCK_PROD

✓ 추가로, 설치 전/후에 언제든지 아래 항목들도 꼭 수정해 주세요!
  • JWT_SECRET_KEY 
  • GMAIL_OAUTH_USER 
  • GMAIL_OAUTH_CLIENT_ID
  • GAMIL_OAUTH_CLIENT_SECRET 
  • GAMIL_OAUTH_REFRESH_TOKEN
  
  [Q] GMAIL_... 항목에는 무엇을 넣어야 하나요?
  [A] .env 파일 맨 아래 부분에 적힌 참고) 부분의 URL을 
      브라우저에 복사 & 붙여넣기 한 후에, 
      소개된 내용을 그대로 따라하시면서 OAUTH 아이디, 
      비밀번호, 토큰 등을 발급 받으시길 바랍니다.

✓ 설치 과정에서 문제가 생길경우 .env 파일을 먼저 수정했는지 
  확인해 주시고, 사용에 어려움이 있으실 경우 
  tsboard.dev 사이트를 방문해서 문의를 남겨주세요!

`

export const install = `
 _           _        _ _       
(_)         | |      | | |      
 _ _ __  ___| |_ __ _| | |      
| | '_ \\/ __| __/ _\` | | |      
| | | | \\__ \\ || (_| | | |_ _ _ 
|_|_| |_|___/\\__\\__,_|_|_(_|_|_)

.env 파일에 입력된 MySQL(Maria) DBMS 정보를 이용하여
데이터베이스 및 테이블들을 추가합니다...

`
export const foundEnv = `
 __                       _                    
/ _|                     | |                   
| |_ ___  _   _ _ __   __| |    ___ _ ____   __
|  _/ _ \\| | | | '_ \\ / _\` |   / _ \\ '_ \\ \\ / /
| || (_) | |_| | | | | (_| |  |  __/ | | \\ V / 
|_| \\___/ \\__,_|_| |_|\\__,_| (_)___|_| |_|\\_/  

.env 파일이 이미 생성되어 있습니다.
 `
