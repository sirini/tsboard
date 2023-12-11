/**
 * install/welcome.ts
 *
 * 설치 실행 시 보여줄 메시지들 모음
 */
export const env = `
#
# TSBOARD 서버쪽 설정 파일
# 클라이언트쪽 설정은 vite.config.ts 참조
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

export const foundEnv = `
 __                       _                    
/ _|                     | |                   
| |_ ___  _   _ _ __   __| |    ___ _ ____   __
|  _/ _ \\| | | | '_ \\ / _\` |   / _ \\ '_ \\ \\ / /
| || (_) | |_| | | | | (_| |  |  __/ | | \\ V / 
|_| \\___/ \\__,_|_| |_|\\__,_| (_)___|_| |_|\\_/  

 `

export const welcome = `
 _       _                         _ 
| |_ ___| |__   ___   __ _ _ __ __| |
| __/ __| '_ \\ / _ \\ / _\` | '__/ _\` |
| |_\\__ \\ |_) | (_) | (_| | | | (_| |
 \\__|___/_.__/ \\___/ \\__,_|_|  \\__,_|

v0.8.0 | tsboard.dev | Currently only available in Korean.

✓ TSBOARD 설치 화면에 오신 것을 환영합니다!
  이 프로그램 설치를 위해 여러분은 아래 Github 페이지에서 설치 가이드를
  확인 하셨을 겁니다.

  https://github.com/sirini/tsboard

  어렵더라도 포기하지 마시고 위의 설치 가이드를 하나씩 따라가 보면서
  여러분만의 커뮤니티 사이트 개발에 성공하시길 바랍니다!
  여러 난관들이 여러분들을 기다리고 있지만, 도움이 필요할 땐
  언제든지 tsboard.dev 에 와주세요!

✓ 이제 .env 파일이 생성되었습니다! .env 파일을 에디터로 열어 
  아래 내용을 수정하세요!
  • DB_HOST • DB_USER • DB_PASS • DB_DATA • DB_SOCK_PROD

✓ 추가로, 설치 전/후에 언제든지 아래 항목들도 꼭 수정해 주세요!
  • JWT_SECRET_KEY 
  • GMAIL_OAUTH_USER 
  • GMAIL_OAUTH_CLIENT_ID
  • GAMIL_OAUTH_CLIENT_SECRET 
  • GAMIL_OAUTH_REFRESH_TOKEN

✓ 설치 과정에서 문제가 생길경우 .env 파일을 먼저 수정했는지 
  확인해 주시고, 사용에 어려움이 있으실 경우 
  tsboard.dev 사이트를 방문해서 문의를 남겨주세요!
  또한 설치에 먼저 성공하신 여러분들의 따뜻한 피드백 기다립니다!

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

export const complete = `
     _                       ___  
    | |                     |__ \\ 
  __| | ___  _ __   ___        ) |
 / _\` |/ _ \\| '_ \\ / _ \\      / / 
| (_| | (_) | | | |  __/_ _ _|_|  
 \\__,_|\\___/|_| |_|\\___(_|_|_|_)  

축하합니다!
수정하신 .env 파일 속 내용들을 참조하여 ${process.env.DB_DATA} 데이터베이스 및 
${process.env.DB_TABLE_PREFIX} 로 시작하는 여러 테이블들을 생성하였습니다.

그동안 여러분은 git clone 으로 tsboard 프로젝트를 내려받고,
Github에 적힌대로 이미 nodejs가 설치된 서버에서
bun이라는 약간 생소한 런타임을 추가로 설치 하셨습니다.

그리고 tsboard 프로젝트 폴더 안에서 npm install 명령어를 통해
tsboard가 필요한 모든 라이브러리들을 내려 받으셨습니다.

또한 bun install.ts 명령어로 이 설치 스크립트를 실행하였고,
.env 파일을 수정해서 MySQL(Mariadb) 접속 정보와 JWT 키 변경 및
데이터베이스/테이블들을 성공적으로 추가 하셨습니다!

이쯤되면 이제 곧바로 사용할 수 있어야 할텐데, 아쉽게도 아직 좀 더 남았습니다.
잠깐! 포기하시기 전에, TSBOARD를 통해 멋진 커뮤니티 사이트를 운영할
그 날을 꿈꾸며 저와 함께 조금만 더 나아가 봅시다. 이제 다왔습니다.

https://github.com/sirini/tsboard

위 페이지에서 이어지는 설치 안내를 참고하여 여러분만의 멋진 커뮤니티 사이트를
만들어 보시길 바랍니다! 모든 설치 과정이 끝나면 꼭 tsboard.dev 에 와주셔서
이 험난한 과정을 이겨냈노라 자랑해 주세요! :)
`
