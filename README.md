# TSBOARD

<p align="center">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge"/>
    <img src="https://img.shields.io/badge/Vue.js-4FC08D?logo=vuedotjs&logoColor=fff&style=for-the-badge"/>
    <img src="https://img.shields.io/badge/Vuetify-1867C0?logo=vuetify&logoColor=fff&style=for-the-badge"/>
    <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=fff&style=for-the-badge"/>
    <img src="https://img.shields.io/badge/CSS-639?logo=css&logoColor=fff&style=for-the-badge"/>
</p>

1. TSBOARD란 무엇인가요?
2. 왜 만들었나요?
3. TSBOARD만의 장점은 무엇인가요?

## TSBOARD란 무엇인가요?

TSBOARD는 **Type Safety BOARD**로 커뮤니티 사이트를 제작할 수 있는 웹사이트 빌더입니다.
서버의 부담을 줄이고, 풍부한 사용 경험을 제공하기 위해 노력하고 있습니다.

> TSBOARD는 사용자분들을 위한 자체 커뮤니티를 <https://tsboard.dev/> 사이트에서 운영하고 있습니다.
> 사용하시면서 궁금한 점, 어려운 점들은 위 사이트에서 편하게 문의해 주시면 됩니다.

## 왜 만들었나요?

모던 웹개발을 해보고 싶어서 만들었습니다. 만들다보니 재밌어서 계속 해보고 있습니다.

## TSBOARD만의 장점은 무엇인가요?

- 처음부터 크고 작은 커뮤니티 사이트에서 사용되는 걸 가정하고 개발했습니다. 배터리 포함입니다.
- 더 적은 비용으로 더 많은 트래픽을 감당할 수 있도록 설계되어 있습니다. 여러분의 서버에 좋습니다.
- 필요에 따라 쉽고 안전하게 수정 하실 수 있도록, 타입 안정성을 가지는 언어들(TypeScript, Go)로 개발되었습니다.

---

# TSBOARD 설치

1. TSBOARD 설치에 적합한 서버 환경
2. 미리 알아두어야 할 사항들
3. 설치 진행 안내
4. 설치 후 서버 설정

## TSBOARD 설치에 적합한 서버 환경

- 프론트엔드는 Vue3 + Vuetify 기반이며, `vite`로 컴파일을 진행합니다. (**Node.js 설치** 필요)
  - Node.js는 `npm` 사용을 위해 설치가 필요하며, v22 버전 이상 최신 버전을 권장합니다.
  - 주로 사용하는 `npm` 명령어는 아래와 같습니다.
    - `npm install` : TSBOARD 프로젝트를 내려받은 후 필요한 라이브러리를 서버에 내려 받는데 사용합니다.
    - `npm run dev` : TSBOARD를 개발/수정 할 때 필요한 간이 서버를 `vite`로 띄우기 위해 사용합니다.
    - `npm run build` : TSBOARD의 프론트엔드를 `vite`로 컴파일 하기 위해 사용합니다.
- 백엔드는 사전에 컴파일된 바이너리 파일이 제공되며, 서버에 `libvips` 라이브러리가 설치되어 있어야 합니다.
  - `libvips`는 이미지 파일의 크기를 줄이거나, 포맷을 변경하는 등의 작업에 사용됩니다.
  - TSBOARD가 자체적으로 제공하는 `goapi-linux-x64` 와 같은 바이너리는 `libvips` 라이브러리가 필요합니다.
  - 만약 서버를 직접 운영중이시라면, 쉽게 설치 하실 수 있습니다. 호스팅 사용자는 `libvips` 설치를 요청해보세요.
    - Ubuntu linux : `sudo apt install libvips-dev`
    - Mac : `brew install vips`
- 추천하는 운영 환경은 아래와 같습니다.
  - OS : Ubuntu linux (혹은 linux server), 22.04 이후
  - CPU : 2 core 이상, core수가 많을수록 TSBOARD가 이제 더 잘 활용합니다.
  - RAM : 2GB 이상, 동시접속자가 많을 경우 `goapi`가 ~300MB까지 필요로 할 수 있습니다.
  - DBMS : `MySQL` 혹은 `Mariadb` 최신 버전

## 설치 진행 안내

### TSBOARD 설치

- TSBOARD는 별도의 설치 파일들을 제공하지 않으며, **Git을 통해 설치 및 업데이트를 제공**합니다.
  - 먼저, `git clone https://github.com/sirini/tsboard tsboard.git` 을 실행합니다.
  - 권장하는 설치 경로는 `/var/www/` 하위 경로입니다. `/root/` 는 추천하지 않습니다.
  - 권장 설치 경로에 설치 시 `/var/www/tsboard.git/` 폴더 안에 `goapi-linux-x64` 파일이 존재합니다.
- TSBOARD가 의존하는 패키지들을 내려받습니다.
  - 권장 설치 경로에 설치하셨다면, `/var/www/tsboard.git/` 폴더 위치에서 **의존성 패키지들을 설치**합니다.
  - `npm install` 로 설치하실 수 있습니다. (서버에 Node.js v22 이상 설치 권장)
- 사용하시는 서버의 OS에 맞춰 `goapi-linux-x64` 처럼 백엔드 바이너리 파일을 실행합니다. (실행 권한을 주셔야 할 수도 있습니다)
  - 처음 실행할 경우, 설치 안내가 나타나며 몇가지 정보를 요청드립니다.
  - 이 때 MySQL(Mariadb)의 접속 정보 및 관리자 아이디와 비밀번호를 입력하게 됩니다.
  - 접속 정보가 올바르고 DB 생성 (및 테이블 생성) 권한이 있다면, 문제없이 DB/Table들이 생성됩니다.
  - 설치가 완료되면, `.env` 파일이 새로 생성되며 해당 파일에 주요 설정값들이 저장됩니다.
  - 본인의 서버가 ARM CPU 및 Mac등 다른 종류의 아키텍쳐를 사용할 경우, 백엔드 프로젝트를 직접 내려받아서 컴파일 하실 수 있습니다.
    - `git clone https://github.com/sirini/goapi goapi.git` 실행하여 Go로 작성된 백엔드를 받습니다.
    - 서버에서 Go 언어 툴체인/컴파일러를 설치합니다. (<https://go.dev> 사이트 참조)
    - `go build -o dist/goapi-linux cmd/main.go` 실행하여 바이너리 파일을 빌드합니다.
    - 빌드 된 바이너리 파일을 `tsboard.git` 폴더 안으로 이동 후 실행합니다.
      (`tmux` 같은 터미널 세션 관리 프로그램을 사용하세요)
- TSBOARD 설정 파일을 수정합니다. `tsboard.config.ts` 파일을 `vi` 같은 에디터로 열어주세요.
  - `tsboard.config.ts` 에는 TSBOARD 운영에 필요한 설정들이 들어 있습니다.
    - `PROD_URL` : 본인의 웹사이트 도메인으로 변경
    - `TSBOARD.SITE.NAME` : 본인의 웹사이트 이름으로 변경
    - `TSBOARD.PREFIX` : TSBOARD가 특정 폴더 하위로 접근이 필요할 경우 앞쪽 폴더명 추가 (대부분은 빈 칸)
    - `TSBOARD.SITE.MOBILE.WRITE` : 모바일에서 새 글 작성 버튼 클릭 시 이동할 게시판 ID로 수정
    - `TSBOARD.SITE.MOBILE.PHOTO` : 모바일에서 새 사진 업로드 버튼 클릭 시 이동할 갤러리 ID로 수정
    - `POLICY.NAME` : 사이트 관리자 이름으로 변경 필요
    - `POLICY.EMAIL` : 사이트 관리자의 이메일 주소로 변경 필요
- 새로 생성된 `.env` 파일을 마찬가지로 `vi`등으로 열어서 `tsboard.config.ts` 설정과 맞춰 수정해 줍니다.
  - `.env` 파일일에는 `tsboard.config.ts` 와 중복되는 설정 항목들이 있습니다.
  - 두 파일 모두에서 동일한 설정값이 적용되도록 해주세요. (예: 백엔드 서버 포트 번호를 둘 다 `3003` 으로 변경)
  - `.env` 파일 속 내용이 외부로 유출되지 않도록 각별히 주의해주세요.
  - 이 파일이 삭제되면 TSBOARD는 다시 설치 화면부터 나타납니다.
- `index.html` 파일도 에디터로 열어서 `<title>` 태그에 본인의 사이트 이름으로 변경해주세요.
- 검색 엔진들의 색인 작업을 돕기 위해 `public/robots.txt` 파일을 에디터로 열어 사이트 주소를 수정해 주세요.
  - `robots.txt` 파일에는 기본으로 TSBOARD 공홈 주소가 적혀 있습니다. 반드시 여러분의 주소로 변경해 주세요!
- `src/pages/home/HomePage.vue` 파일을 에디터로 열어 본인 사이트에 맞게 미리 수정해 주세요.
- 이제 수정해야 할 것들을 모두 완료하였습니다. TSBOARD를 `build` 합니다!
  - 여러분이 받으신 TSBOARD는 이제 `vite` 를 통해 `build` 가 가능합니다.
  - `npm run build` 를 실행합니다. 빌드가 정상적으로 완료되면, tsboard 폴더 안에 `dist/` 폴더가 생성됩니다.

### 메일 발송 기능 활성화하기

- TSBOARD는 구글 계정의 앱 비밀번호 기능을 이용하여 `GMAIL` 발송이 가능합니다.
  - 메일 발송을 통해 최초 회원가입 시 이메일 인증을 진행할 수 있습니다.
  - 비밀번호 초기화도 등록된 메일로 직접 가능하므로, 가능하면 **기능 활성화를 권장**합니다.
  - TSBOARD 설치 경로에 `.env` 파일을 열어서 본인의 구글 계정과 앱 비밀번호를 등록해주세요.

```
# .env
# 구글 앱비밀번호 for GMAIL 발송
# 참고) https://velog.io/@seul06/nodemailer
GMAIL_ID=yourgmailaddress@gmail.com
GMAIL_APP_PASSWORD=passwordfromgoog
```

> 구글 계정 고객센터에 등록된 이 글을 통해 앱 비밀번호를 어떻게 얻을 수 있는지 확인 하실 수 있습니다. <https://support.google.com/accounts/answer/185833?hl=ko>

### 소셜 로그인 활성화하기

- TSBOARD는 구글, 네이버 및 카카오 로그인을 지원합니다.
  - 해당 로그인 서비스 제공업체에서 요구하는 개발자 등록 및 OAuth 클라이언트 ID, 비밀번호등은 직접 준비하셔야 합니다.
  - 이미 해당 정보들을 가지고 계신 분들은 `.env` 파일에서 ID, Secret 정보를 입력하시면 사용 가능합니다.
  - 추가로, `tsboard.config.ts` 파일에서 `OAUTH` 항목을 통해 사용할 소셜 로그인을 개별적으로 선택하실 수 있습니다. (사용을 원치 않으시면 `IS_READY` 항목을 `false` 로 변경 후 저장하시면 됩니다.)
    - `tsboard.config.ts` 파일을 수정하신 경우 `npm run build` 를 통해 프로젝트를 `build` 해주세요!
    - 그 후 TSBOARD 설치 경로 (예: `/var/www/tsboard.git/`)에서 `goapi-linux-x64`로 백엔드를 실행해 주세요.

```
# .env
# 구글 OAuth 클라이언트
OAUTH_GOOGLE_CLIENT_ID=your_google_client_id_from_https://console.cloud.google.com
OAUTH_GOOGLE_SECRET=your_google_client_secret_from_https://console.cloud.google.com

# 네이버 OAuth 클라이언트
OAUTH_NAVER_CLIENT_ID=your_naver_client_id_from_https://developers.naver.com
OAUTH_NAVER_SECRET=your_naver_client_secret_from_https://developers.naver.com

# 카카오 OAuth 클라이언트
OAUTH_KAKAO_CLIENT_ID=your_kakao_client_id_from_https://developers.kakao.com
OAUTH_KAKAO_SECRET=your_kakao_client_secret_from_https://developers.kakao.com
```

### AI 기능 활성화하기

> OpenAI의 API Key가 없더라도 TSBOARD 기본 기능 사용에는 아무런 문제가 없습니다. AI를 활용하는 기능들만 비활성화 됩니다.

- TSBOARD는 OpenAI의 `ChatGPT-4o` 모델을 활용하여 이미지 설명글 추출 등의 기능을 사용하실 수 있습니다.
  - 이 기능은 소셜 로그인처럼 원하실 경우에 사용하시면 됩니다. (OpenAI의 API Key 값이 필요합니다.)
  - 기능 활성화를 위해서는 `.env` 파일에 `OPENAI_API_KEY` 부분을 업데이트 하셔야 합니다.
  - OpenAI의 API 발급은 무료가 아닙니다! TSBOARD는 OpenAI가 제공하는 기능을 활용할 뿐입니다.

```
# .env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_from_https://openai.com/index/openai-api/
```

### TSBOARD 업데이트

> 업데이트 전에 기존 TSBOARD는 늘 다른 경로에 백업하는 걸 권장합니다. DB의 경우에도 `mysqldump` 프로그램을 통해 백업하시고 작업을 진행하세요!

- 설치 후 TSBOARD를 업데이트 하고자 할 땐 `git pull` 를 실행하시면 됩니다.
  - `git pull` 진행 시 여러분이 직접 수정하신 파일과, TSBOARD에서 변경된 내용이 충돌날 수 있습니다.
  - 이 때는 본인의 수정 내용과 TSBOARD 변경사항을 직접 `merge` 하셔야 합니다.
  - 변경사항이 많이 따라가기 어려울 때는, 작업하신 내용을 먼저 백업한 이후 하나씩 `merge` 해주세요.
  - `git stash` 명령어를 통해 따로 작업하신 내용을 잠시 치운 후, 변경사항을 업데이트하고 다시 이전 작업을 반영하는 방법도 있습니다.
  - 가능하면 `git pull` 명령어를 통해 변경사항을 수시로 업데이트 할 수 있도록 관리해 주세요!
- `git pull` 이후에는 `npm run build` 명령어로 프로젝트를 `build` 합니다!
  - 빌드 하기 전에 `tsboard.config.ts` 파일이나 `index.html` 혹은 `public/robots.txt` 가 제대로 수정되었는지 확인해 보세요!
  - `src/pages/home/HomePage.vue` 파일에 반영하신 작업들이 있을 경우 마찬가지로 다시 확인해 보세요.
  - 이 밖에 수정하신 파일들이 `git pull` 이후에도 제대로 변경사항을 유지하고 있는지 확인이 필요합니다.
- 때때로 DB 테이블 변경 등을 위한 업데이트 작업이 필요합니다.
  - 이 때는 백엔드를 실행하실 때 `./goapi-linux-x64 update` 처럼 update 인자를 추가로 전달하면서 실행해 보세요!

### TSBOARD 백엔드 실행하기

- 사용하시는 서버의 운영체제에 맞춰서 미리 컴파일된 바이너리 파일을 실행하시면 됩니다.
- `goapi-linux-x64` 처럼 실행하시면 되며, 가급적 `tmux` 나 `screen` 과 같은 별도의 세션 관리 프로그램을 통해서 실행을 권장합니다.
  - 그냥 실행하시면, 터미널을 닫으실 경우 TSBOARD의 백엔드 서버도 바로 종료됩니다!
- 경우에 따라, 바이너리 파일에 실행 권한을 부여해 주셔야 할 수도 있습니다: `chmod +x ./goapi-linux-x64` 처럼요!

## 설치 후 서버 설정

> TSBOARD는 보안을 위해 `SSL` 적용을 강력히 권장합니다.

> Ubuntu 22.04에서 Nginx 암호화하기 <https://velog.io/@mero/ubuntu-22.04%EC%97%90%EC%84%9C-Nginx-%EC%95%94%ED%98%B8%ED%99%94%ED%95%98%EA%B8%B0> 혹은 무료 SSL 인증서인 letsencrypt 설치 방법을 검색하신 후 운영하시는 서버에 적용해 보세요.

- 아래 단계에서는 Ubuntu server 에 `Nginx` 가 설치되어 있는 것으로 가정합니다. (만약 `apache2` 가 설치되어 있더라도, 예를 들어 `/etc/apache2/sites-enabled/000-default` 파일을 수정하시면 됩니다.)
- `Nginx` 의 설정 파일 내용을 일부 수정해야 합니다. `vi /etc/nginx/sites-enabled/default` 를 실행합니다.
- `server { ... }` 사이의 내용들을 수정해야 합니다. **TSBOARD가 권장 설치 경로에 설치된 걸로 가정**합니다.

```
# /etc/nginx/sites-enabled/default
#
# TSBOARD가 권장 설치 경로에 설치되어 있고,
# 현재 운영중인 웹사이트의 도메인이 tsboard.dev 인걸 가정하고 있습니다.
# 아울러, tsboard.config.ts 파일에서는 API_PORT 값이 3003으로 되어 있는 걸 가정하고 있습니다.
# .env 파일에서도 GOAPI_PORT 값이 3003으로 되어 있는 걸 가정하고 있습니다.
# (만약 포트 번호 변경이 필요하다면, API_PORT, GOAPI_PORT 둘 다 동일한 값으로 저장하셔야 합니다!)
#
server {
  root /var/www/tsboard.git/dist; # TSBOARD_설치경로_예시/dist

  index index.html index.htm;

  server_name tsboard.dev; # 사용하시는 도메인 이름으로 변경 필요

  # 최대 업로드 허용 크기, tsboard.config.ts 파일의 TSBOARD.MAX_UPLOAD_SIZE 주석 참조
  client_max_body_size 20M;

  location /upload {
    root /var/www/tsboard.dev; # TSBOARD_설치경로_예시, 이 폴더 아래에 upload 폴더 위치
    try_files $uri $uri/ =404;
  }

  location / {
    try_files $uri $uri/ /index.html; # Vue Router 활용을 위한 설정 (CSR)
  }

  # v1.0.0부터 기존 /tsapi 가 /goapi 로 변경됨 (타 백엔드와 충돌 방지)
  location /goapi {
    # tsboard.config.ts 에서 PORT_PROD 값과 아래 3003과 동일해야 함
    proxy_pass http://127.0.0.1:3003/goapi;
    proxy_buffering off;
    proxy_connect_timeout 300;
    proxy_send_timeout 300;
    proxy_read_timeout 300;
    send_timeout 300;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # 이미 SSL 설정을 하셨다면 보통 하단에 관련 내용이 나타납니다.
}
```

- 추가로, `apache2` 웹서버를 사용중이신 분들은 아래 내용을 참조해 주세요! (참고: <https://enginnersnack.tistory.com/15>)

```
#
# /etc/apache2/site-available/000-default.conf
#
# apache2 웹서버 사용 시 TSBOARD 설정 예시입니다. 위 참고 페이지도 확인해보세요!
#
<VirtualHost *:443>
  DocumentRoot /var/www/tsboard.git/dist  # TSBOARD_설치경로_예시/dist
  ProxyRequests Off
  ProxyPreserveHost On
  <Proxy *>
    Order deny,allow
    Allow from all
  </Proxy>
  # tsboard.config.ts 에서 PORT_PROD 값과 아래 3003 이 동일해야 함
  ProxyPass /goapi http://127.0.0.1:3003/goapi
  ProxyPassReverse /goapi http://127.0.0.1:3003/goapi
</VirtualHost>
```

---

# TSBOARD 설명

> 아래부터는 알아두면 언젠가 쓸모가 있을수도 있는 내용들입니다.
> 혹시 TSBOARD에 어째서 별도로 스킨을 선택하는 메뉴가 없는지 궁금하신 분들은 3번 커스텀 가이드를 참조해 주세요!

1. 전체 구조
2. 테이블 구조
3. 커스텀 가이드

## 전체 구조

### 프론트엔드 : Vue, Vuetify, Tiptap, Pinia, Vue Router

- 프론트엔드는 `Vue`, `Vuetify`, `Vue Router`, `Pinia` 그리고 에디터에 `tiptap` 이 사용됩니다.
- `.vue` 파일에서 UI는 대부분 `Vuetify` 컴포넌트를 사용하는 걸로 구현되어 있습니다. 대부분 `<v-card>` 처럼 `v-` 접두사를 가집니다.
- 버튼을 클릭하거나, `.vue` 파일이 브라우저에 붙는 시점에 초기화 작업들을 해야 할때는 Pinia로 정의한 스토어들을 `import` 한 후 필요한 함수들을 사용하도록 구성했습니다. 따라서 대부분의 UI쪽 로직들, 특히 서버쪽에 요청을 보내는 함수들은 `src/store/` 내 파일들을 참조하시면 됩니다.
- 페이지 열람은 항상 Vue Router 기준입니다.
  - 만약 기존에 게시판 목록보기 페이지인 `src/pages/board/List.vue` 을 그대로 둔 상태에서, 다른 디자인의 목록보기 페이지를 예를 들어 `src/pages/something_new_board/AwesomeList.vue` 경로에 만들었다고 합시다.
  - 게시판 목록을 새로 만든 디자인으로 보길 원한다면, 추가로 `src/router/board.ts` 파일을 열어서 `@/pages/board/List.vue` 로 적힌 부분을 모두 `@/pages/something_new_board/AwesomeList.vue` 로 수정해야 합니다.
  - TSBOARD는 Client Side Rendering 방식으로 동작합니다. 따라서 모든 접속 경로는 반드시 `src/router/index.ts` 를 통해 결정됩니다.
- 어쩌면 가장 궁금하실 수 있는 부분인데, TSBOARD는 **Client Side Rendering** 방식으로 동작합니다.
  - TSBOARD 개발 초기부터, 가능하면 서버의 부담을 줄이는 방향으로 개발하고자 했습니다. 브라우저 성능은 계속해서 개선되고 있고, 네트워크도 점점 빨라지면서 이제는 진짜 클라이언트가 좀 더 부담스런 작업들을 많이 해도 괜찮겠다고 생각했었거든요.
  - 그리고, SEO(Search Engine Optimization) 관련한 대책은 아래 별도의 절에서 설명드리고자 합니다.

### SEO (검색 엔진 최적화) 방안

- 검색 엔진 최적화를 위해 TSBOARD는 `public/robots.txt` 파일에 지정된 `Sitemap:` 경로를 통해 **서버에서 렌더링한 main.html 페이지를 제공**합니다. (v0.8.40 이상 버전부터 지원)
  - 기본 경로는 `https://tsboard.dev/goapi/seo/sitemap.xml` 이며, 설치 안내에서 `tsboard.dev` 부분을 본인의 도메인으로 수정해야 한다고 말씀드린 적이 있습니다!
- 아래 `sitemap.xml` 예시 내용입니다.

  ```xml
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tsboard.dev/goapi/seo/main.html</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>2024-06-02</lastmod>
  </url>
  <url>
    <loc>https://tsboard.dev/goapi/seo/about.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
    <lastmod>2024-06-02</lastmod>
  </url>
  <url>
    <loc>https://tsboard.dev/board/free</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>2024-06-02</lastmod>
  </url>
  <url>
    <loc>https://tsboard.dev/board/photo</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>2024-06-02</lastmod>
  </url>
  </urlset>
  ```

- 위 예시에서 가장 중요한 링크는 `https://tsboard.dev/goapi/seo/main.html` 입니다. 크롤러가 해당 페이지를 방문하면, 여러분의 서버에서 TSBOARD가 준비한 html 페이지를 만나게 됩니다.
- 해당 페이지에서는 `src/pages/home/HomePage.vue` 에서 보여지는 게시글들 및 댓글들이 출력됩니다. 얼마나 많이 출력해서 크롤러에게 제공할지는 `tsboard.config.ts` 의 `SEO` 항목을 통해 조절하실 수 있습니다.
- 크롤러가 수집하는 내용 중에 게시글 링크나 사이트 링크의 경우 기존 페이지로 링크가 걸립니다. 따라서 검색을 통해 해당 `main.html` 페이지를 열람한 사용자는 어떤 링크를 클릭하든 원래 페이지를 방문하게 됩니다.

> 결과적으로 검색 엔진 크롤러는 위의 `main.html` 페이지를 통해 검색에 필요한 데이터들을 얻고, 사용자는 검색 엔진이 수집한 `main.html` 페이지를 통해 다시 기존의 CSR 페이지로 유입되는 셈입니다.

## DB 테이블

- TSBOARD는 기본적으로 정규화된 테이블 구조를 지향하지만, `SELECT` 쿼리의 횟수를 줄이기 위해서나 혹은 데이터 관리를 보다 편하게 하기 위해 일부 중복된 데이터를 가지도록 구성되어 있습니다.
  - 예를 들어, `post` / `post_hashtag` / `post_like` / `comment_like` / `file` / `image` 테이블에서 공통적으로 들어가는 `board_uid` 컬럼의 경우 게시판 단위로 통계를 뽑아보거나, 삭제 등의 처리를 보다 편하게 하기 위해 사실은 없어도 되는 컬럼을 일부로 추가한 것입니다.
  - 정수 크기만큼의 비용을 추가로 지불하고, 대신 관리의 편의성을 높인 셈입니다.
  - 반면, `post` 테이블에 `hit` 컬럼과 더불어 있어야 할 것 같은 `reply_count` 나 `like_count` 컬럼은 존재하지 않습니다. 각각 연관 테이블을 검색해서 필요할 때마다 카운팅을 하여 가져옵니다. 이는 의도한 것으로, 게시글을 저장하는 테이블을 `post` 테이블 하나만 지정한 대신, 댓글이 작성/삭제 되거나 좋아요가 변경될 때마다 잦은 `UPDATE` 가 일어나지 않도록 하기 위함입니다. 또한 `post`, `comment` 테이블이 가능한 작은 크기를 유지할 수 있도록 하기 위해서이기도 합니다.
- 가장 궁금해하실 부분, 왜 **게시판을 생성할 때마다 테이블을 새로 만들지 않고 post, comment 테이블을 각각 하나로 유지**하는 선택을 했는지 설명드리고자 합니다.
  - TSBOARD는 테이블들의 인덱스에 비용을 좀 더 지불하고, 대신 테이블 자체를 게시판 생성에 맞춰 더 만들거나 줄이지 않음으로서 전체 검색이나 게시글 이동과 같은 기능을 쉽게 구현하고자 현재 구조를 선택하게 되었습니다.
  - `post`, `comment` 테이블이 하나로 고정되지만, 보관하는 데이터의 대부분은 사실 외부 키이며 나머지도 대부분 크기가 고정된 정수형 컬럼입니다. 이를 통해 테이블에 가해지는 부담을 줄였습니다.
  - 이러한 디자인을 선택한 대신, 보다 극한의 인덱스 활용을 위해 TSBOARD는 게시글을 삭제해도 실제로 `DELETE` 작업 대신 상태값만 변경하는 식으로 해서 인덱스가 항상 hit 되도록 하였습니다. 결과적으로 TSBOARD는 게시판을 얼마나 많이 만들더라도 DB에 가해지는 부담없이 **여전히 빠르게 동작 가능**합니다.

```
# 전체 테이블 목록은 아래와 같습니다. (`tsb_` 부분은 설치 단계에서 변경 가능)

+-----------------------+
| Tables_in_tsboard     |
+-----------------------+
| tsb_board             |
| tsb_board_category    |
| tsb_chat              |
| tsb_comment           |
| tsb_comment_like      |
| tsb_exif              |
| tsb_file              |
| tsb_file_thumbnail    |
| tsb_group             |
| tsb_hashtag           |
| tsb_image             |
| tsb_image_description |
| tsb_notification      |
| tsb_point_history     |
| tsb_post              |
| tsb_post_hashtag      |
| tsb_post_like         |
| tsb_report            |
| tsb_trade             |
| tsb_user              |
| tsb_user_access_log   |
| tsb_user_black_list   |
| tsb_user_permission   |
| tsb_user_token        |
| tsb_user_verification |
+-----------------------+
```

## 커스텀 가이드

### 커스텀 원칙 - 새로운 디자인은 새로운 파일에서

- 앞선 글에서 `src/pages/board/List.vue` 를 `src/pages/something_new_board/AwesomeList.vue` 로 바꿔서 보여주는 걸 설명드렸었는데, 여기서 핵심은 기존의 `src/pages/board/List.vue` 파일을 수정하지 않고, 해당 파일을 `src/pages/something_new_board/AwesomeList.vue` 위치로 복사한 다음 수정하고 Vue Router 경로를 바꿔주는 것입니다.
- 그냥 `src/pages/board/List.vue` 파일을 수정해서 쓰면 안될까요? Vue Router 를 수정할 필요도 없으니 더 간편해 보입니다. 하지만 아래의 이유들로 인해 커스텀을 하실 때는 반드시 기존 파일을 먼저 복사한 후에 진행하시는 걸 권장합니다.
  - 기존 파일 (예를 들어 게시판 목록보기를 수정한다고 치면 `src/pages/board/List.vue`)을 수정할 경우, 추후 TSBOARD가 업데이트 되었을 때 충돌이 날 가능성이 높습니다. 이 경우 수정하신 부분을 새로 변경된 사항들과 일일히 대조해서 업데이트 해야 합니다.
  - 새로운 파일을 만들고 Vue Router 만 업데이트 하게되면, TSBOARD 업데이트 시 Vue Router (지금 예시 기준이면 `src/router/board.ts`) 만 다시 살펴보고 필요시 변경해주면 됩니다.
  - 무엇보다, 지금 예시 기준으로 커스텀한 게시판 목록보기에 뭔가 이상이 있거나 기능이 제대로 동작하지 않을때 대조해볼 수 있는 기준(순정 파일)이 있는 게 좋습니다.
- 게시판을 기준으로 새로운 커스텀 디자인의 게시판을 만드는 프로세스는 아래와 같습니다.
  - 먼저 `src/pages/board/` 폴더를 복사해서 `src/pages/custom_board/` 경로에 붙여넣습니다. 폴더 경로는 여러분들이 원하시는대로 하셔도 됩니다. 예를 들어, `src/pages/custom/board/` 처럼 하셔도 무방합니다.
  - 다음으로, Vue Router 에서 경로를 새로 복사한 경로로 수정합니다. 지금 예시 기준이면 `src/router/board.ts` 파일을 열고, `import("@/pages/board/List.vue")` 처럼 되어 있는 부분에서 `/board/` 를 `/custom_board/` 로 수정합니다. 개발 모드로 실행중이라면 `vite` 서버가 재실행되면서 이제 게시판 목록을 볼 때 새로운 경로로 접근합니다.
  - 마지막으로, `src/pages/custom_board/` 의 `List.vue`, `View.vue`, `Write.vue` 파일들을 입맛에 맞게 수정합니다. 파일명도 바꾸길 원하신다면 (예를 들어 `List.vue` 대신 `AwesomeList.vue` 처럼) 바꾸셔도 됩니다만, 권장사항은 폴더명만 바꿔서 사용하시는 것입니다.
  - 참고로, `List.vue`, `View.vue`, `Write.vue` 파일들은 모두 `src/components/board/` 경로 아래에 있는 여러 Vue 컴포넌트들을 참조하고 있습니다.
  - 만약 참조하는 컴포넌트들까지 모두 커스텀하고 싶다면, `src/pages/custom_board/components` 경로에 커스텀할 폴더와 파일들을 복사한 다음, 수정하고 `List.vue` 처럼 해당 컴포넌트들을 `import` 하는 파일들의 경로도 수정해주시면 됩니다.

---

# TSBOARD 개발 계획

> 새로운 웹서비스 개발을 생각하고 계신가요? 커뮤니티, 쇼핑몰, 블로그... 그 어떤 것이든 가능합니다.
> 처음부터 개발하실 필요 없습니다. 이제 TSBOARD를 기반으로 빠르게 여러분만의 프로젝트를 시작해 보세요!
> 보다 안전하고 빠르게 개발 하실 수 있도록, TSBOARD가 함께 하겠습니다.

## 로드맵

- `v0.8.z` (초기 버전)
- `v0.9.z`
  - 블로그 기능 추가 및 개선 작업이 반영됩니다.
  - CSR 방식 기반에서 SEO를 좀 더 개선하기 위한 추가 작업들이 반영됩니다.
- `v1.0.0`
  - 백엔드를 `Bun` 런타임에서 `Go` 언어로 재작성한 자체 바이너리 파일로 대체합니다.
- `v1.0.z` (현재)
  - 백엔드 서버의 안정성 및 속도 개선을 위한 튜닝을 진행합니다.
  - 중고 물품 거래용 게시판 기능이 추가됩니다.
- `v1.1.0`
  - TSBOARD 기반 커뮤니티 사이트용 안드로이드 앱을 출시할 예정입니다.
- `1.2.0`
  - 쇼핑몰 테마를 제공합니다. 기본적인 재고 현황/관리 등도 추가됩니다.
  - 토스, 네이버페이와 연동합니다.
- `2.0.0`
  - TBD

> 로드맵은 개발자의 사정에 따라 언제든지 변경될 수 있습니다!

## 잘 부탁드립니다!

- 테스트도 많이 해보시고, 불편한 점은 언제든지 말씀해주세요!
- 웹 생태계에 작게나마 보탬이 될 수 있으면 좋겠습니다.
- 언젠가 TSBOARD로 만들어진 멋진 커뮤니티를 만나는 그 날을 꿈꿔봅니다!

> 궁금하신 점이 있으시다면 언제든지 <https://tsboard.dev> 사이트에 와주세요!
