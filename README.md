# TSBOARD

<p align="center">
    <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?&style=for-the-badge&&logoColor=white"/>
    <img src="https://img.shields.io/badge/MySQL-4479A1.svg?&style=for-the-badge&&logoColor=white"/>
    <img src="https://img.shields.io/badge/Bun-000000.svg?&style=for-the-badge&&logoColor=white"/>
    <img src="https://img.shields.io/badge/ElysiaJS-B087FB.svg?&style=for-the-badge&&logoColor=white"/>
    <img src="https://img.shields.io/badge/Vue-4FC08D.svg?&style=for-the-badge&&logoColor=white"/>
    <img src="https://img.shields.io/badge/Vuetify-1867C0.svg?&style=for-the-badge&&logoColor=white"/>
    <img src="https://img.shields.io/badge/HTML-E34F26.svg?&style=for-the-badge&&logoColor=white"/>
    <img src="https://img.shields.io/badge/CSS-1572B6.svg?&style=for-the-badge&&logoColor=white"/>
</p>

1. TSBOARD란 무엇인가요?
2. 왜 만들었나요?
3. TSBOARD만의 장점은 무엇인가요?
4. 그렇다면 단점은 무엇이고 어떻게 개선할 생각인가요?

## TSBOARD란 무엇인가요?

TSBOARD는 Type Safety BOARD로, TypeScript 언어로 작성된 커뮤니티 빌더입니다.

## 왜 만들었나요?

- 저는 웹 프로그램을 `PHP`로 시작했고, 제로보드와 그누보드 시절을 겪은 (이제는 아재) 개발자입니다.
- 제 머리 속 마지막 `JavaScript` 언어에 대한 추억은 `jQuery` 없으면 쓰레기(...)같은 언어, 정도였습니다.
- 그러나 지속적인 표준안 개선과 `Node.js` 의 등장, `TypeScript` 언어에 뒤늦게 반해버렸습니다.
- 그래서 다시 웹 프로그램을 한 번 만들어보고 싶었고, **늘 만들었던 게시판을 TypeScript 언어로만 작성**해보고 싶었습니다.
- 그래서 시작하게 되었습니다.

> (존경하는 우리나라 게시판의 근본, 그누보드가 PHP에서 파이썬으로 업데이트 하는 걸 보고 자극받은 것도 있습니다 😉)

## TSBOARD만의 장점은 무엇인가요?

- TSBOARD는 프론트엔드와 백엔드 모두 `TypeScript` 언어로 작성되어 **타입 안정성을 보장**합니다.
- 프론트엔드는 `Vue` 와 `Vuetify` 로 제작되어 있어 유려하면서도 빠른 UI 개발이 가능합니다.
- JS/TS 런타임으로 `Bun`, 웹 프레임워크로 Bun 기반의 `ElysiaJS`를 선택하여 **보다 빠른 동작이 가능**합니다.
- Node.js 기반의 풀스택 개발을 해보신 분들에게는 쉽게 이해되며, 바로 활용 가능한 디자인입니다.
- 중소규모의 커뮤니티 사이트를 제작하는데 필요한 **모든 기능들이 내장**되어 있습니다.

## 그렇다면 단점은 무엇이고 어떻게 개선할 생각인가요?

- TSBOARD는 **백엔드를 Bun에 전적으로 의지**하고 있습니다.
  - Bun은 23년 9월 1.0 버전이 출시되었고, 이후 안정화 단계를 거치고 있습니다.
  - 즉, 아직까지는 크고 작은 문제들이 있습니다.
  - 예를 들어, 가상서버(정확히는 가상 CPU)에서는 Bun이 제대로 동작하지 않습니다.
  - 또한 패키지 관리 기능도 겸하고 있지만, `npm` 대비 아직 호환성이 떨어집니다.
  - 성능을 위해 Bun 을 선택한만큼, 인내하며 더 안정화 되길 바라고 있습니다.
- TSBOARD는 **프론트엔드를 Vue 와 Vuetify에 전적으로 의지**하고 있습니다.
  - 왜 `React`나 `Svelte`를 선택하지 않았냐는 원망 아닌 원망도 겸허히 받아들입니다.
  - `Vue` 의 간결성과 Single File Component가 마음에 들어 선택하였습니다.
  - 또한, `Vuetify`의 풍부한 UI 컴포넌트들이 좋아서 선택하게 되었습니다.
  - 즉, 여러분은 이제 Vue 문법과 Vuetify 활용법을 모르실 경우 새로 배우셔야 합니다.
  - 이부분은 제가 아는 선에서 여러분들과 함께 배우며 도움을 드리겠습니다.
- TSBOARD는 **TypeScript 단일 언어로 작성**되어 있습니다.
  - 물론 여전히 `HTML`과 `CSS`라는 친구가 남아있습니다만, 더이상 PHP언어는 없습니다.
  - `PHP`와 달리, `TypeScript` 는 Transpile 과정이 필요하고, 개발 환경 세팅도 쉽진 않습니다.
  - 개발자 분들은 별 거 아니겠지만, 웹서비스 운영자 입장에서는 쉽지 않은 도전입니다.
  - `TypeScript` 언어에 대한 애정을 바탕으로, 여러분들과 함께 배우는 자세로 도움을 드리겠습니다.
  - 어렵다고 포기하지 마시고, TSBOARD와 함께 새로운 언어를 배워보면 좋겠습니다.

> TSBOARD는 사용자분들을 위한 자체 커뮤니티를 <https://tsboard.dev/> 사이트에서 운영하고 있습니다.
> 사용하시면서 궁금한 점, 어려운 점들은 위 사이트에서 편하게 문의해 주시면 됩니다.

---

# TSBOARD 설치

1. TSBOARD 설치에 적합한 서버 환경
2. 미리 알아두어야 할 사항들
3. 설치 진행 안내
4. 설치 후 서버 설정
5. 설치가 어려운 분들께

## TSBOARD 설치에 적합한 서버 환경

- TSBOARD는 **백엔드 JS/TS 런타임으로 Bun** (<https://bun.sh>)을 요구합니다.
- 또한, 보다 안정적인 패키징 관리를 위해 Node.js (및 npm) 설치도 권장하고 있습니다.
  - 원래 Bun은 패키지 관리까지 올인원으로 지원하므로, **향후 Bun만 필요할 것**입니다.
  - 만약 아직 Node.js 설치가 안되어 있는 서버라면, 우선 Bun 먼저 설치하여 사용해 보세요.
  - Bun 의 패키지 관리에 문제가 있어 보이면, Node.js 설치 후 `npm i` 으로 바로 잡을 수 있습니다.
- **Linux 및 Mac 운영체제만 지원**합니다.
  - Bun은 곧 Windows 운영체제를 지원할 예정입니다. (안정적인 운영은 24년 하반기 예상)
- Cafe24등 웹호스팅 업체의 서비스를 이용하실 예정이라면, 아래 사항들을 참조해 주세요.
  - PHP 게시판이나 워드프레스 설치 등으로 우리가 흔히 접하는 웹호스팅에선 활용이 어렵습니다.
  - 웹호스팅이 아닌, **서버 호스팅의 경우 사용이 가능**합니다.
  - 단, 가상 CPU로 운영되는 (보통 저렴한) 가상 서버 서비스에서는 제대로 동작하지 않습니다.
- 독립적인 하드웨어 자원이 있으시거나, 이미 Node.js 기반으로 서비스를 운영해보셨다면 대부분 지원됩니다.

## 미리 알아두어야 할 사항들

- TSBOARD 설치는 대부분 `CLI` (명령줄 인터페이스)를 통해 진행됩니다.
  - 보통 웹게시판들은 설치 시 .zip 파일을 받아서 압축을 풀고, FTP로 업로드 후 브라우저에서 설치합니다.
  - 그러나, TSBOARD는 `SSH` 등으로 서버에 직접 접속한 후 `git clone` → `bun setup.ts` 으로 설치합니다.
  - CLI 사용이 어려우신 분들은 아래 안내를 건너뛰고, **설치가 어려운 분들께** 항목을 읽어주세요.
- MySQL(Mariadb) 계정이 데이터베이스 생성 권한을 가지고 있어야 합니다.
  - TSBOARD는 설치 과정에서 새로운 데이터베이스 (기본 `tsboard`)를 생성합니다.
  - 만약 MySQL(Mariadb) 접속 계정에 해당 권한이 없다면 설치는 실패합니다.
  - 잘 모르시겠다면 역시 **설치가 어려운 분들께** 항목을 읽어주세요.
- TSBOARD는 웹서버로 Nginx를 권장하며, Bun 설치 전에 Node.js (및 npm) 설치를 권장합니다.
  - TSBOARD가 제공하는 API들은 **설치 후 서버 설정** 단계에서 Nginx reverse proxy 기능을 이용합니다.
  - TSBOARD는 오직 패키지 관리에만 npm 을 사용합니다. (Bun 도 가능은 합니다만...)
  - 추후 Bun의 안정화가 진행되면, Node.js 사전 설치 내용은 제거될 수 있습니다.

## 설치 진행 안내

> 이제부터는 여러분이 TSBOARD를 독자적인 리눅스PC (혹은 Mac) 에 설치하는 것으로 가정합니다.

> TSBOARD 설치 과정에 문제가 있거나, 어려움이 있으실 땐 tsboard.dev를 방문해 주세요!

> 도저히 어떻게 해야할지 모르겠다면, **설치가 어려운 분들께** 항목을 읽어주세요.

### Bun 설치

- Bun은 <https://bun.sh/> 사이트에서 Bun은 무엇인지, 어떻게 설치하는지 등을 확인하실 수 있습니다.
  - 먼저, `curl -fsSL https://bun.sh/install | bash` 명령어로 Bun을 설치합니다.
  - 설치 시 패키지 의존성 관련 메시지들이 나올 수 있습니다. (`curl`, `zip` 등) 먼저 설치해주세요.
  - 설치 후 `source .bashrc` 등을 추가적으로 실행해 Bun 환경변수를 등록 후, `bun --help` 를 실행합니다.

### TSBOARD 설치

- TSBOARD는 별도의 설치 파일들을 제공하지 않으며, **Git을 통해 설치 및 업데이트를 제공**합니다.
  - 먼저, `git clone https://github.com/sirini/tsboard tsboard.git` 을 실행합니다.
  - 권장하는 설치 경로는 `/var/www/` 하위 경로입니다. `/root/` 는 추천하지 않습니다.
  - 권장 설치 경로에 설치 시 `/var/www/tsboard.git/` 폴더 안에 `setup.ts` 파일이 존재합니다.
- TSBOARD가 의존하는 패키지들을 내려받습니다.
  - 권장 설치 경로에 설치하셨다면, `/var/www/tsboard.git/` 폴더 위치에서 **의존성 패키지들을 설치**합니다.
  - 이 패키지들은 (Node.js 가 설치되어 있는 경우) `npm i` 혹은 `npm install` 로 설치합니다.
  - Bun 만 설치하신 경우, `bun install` 로 동일하게 설치하실 수 있습니다.
- `bun setup.ts` 를 실행하여 화면의 안내에 따라 **TSBOARD 설치**를 진행합니다.
  - 이 때 MySQL(Mariadb)의 접속 정보 및 관리자 아이디와 비밀번호를 입력하게 됩니다.
  - 접속 정보가 올바르고 DB 생성 (및 테이블 생성) 권한이 있다면, 문제없이 DB/Table들이 생성됩니다.
  - `bun setup.ts` 과정에서 문제가 발생하신 경우, 깃허브 이슈 혹은 tsboard.dev로 알려주세요!
- TSBOARD 설정 파일을 수정합니다. `tsboard.config.ts` 파일을 `vi` 같은 에디터로 열어주세요.
  - `tsboard.config.ts` 에는 TSBOARD 운영에 필요한 **대부분의 설정**들이 들어 있습니다.
  - `SITE` 와 `API` 항목을 확인하시고, 이름 및 도메인 등을 적절하게 수정 후 저장하세요.
  - 그 밖에 항목들도 원하시면 수정하실 수 있습니다. 단, 가급적 `PORT` 항목은 그대로 두세요.
- 이제 TSBOARD를 `build` 합니다.
  - 여러분이 받으신 TSBOARD는 이제 `vite` 를 통해 `build` 가 가능합니다.
  - (Node.js 설치 시) `npm run build` 혹은 `bun run build` 를 실행하여 `build` 를 진행합니다.
  - 이 때 TSBOARD의 프론트엔드 코드들(TypeScript)이 JavaScript로 변환되며, 파일들도 최적화됩니다.

### 메일 발송 기능 활성화하기

- TSBOARD는 구글 계정의 앱 비밀번호 기능을 이용하여 GMAIL 발송이 가능합니다.
  - 메일 발송을 통해 최초 회원가입 시 이메일 인증을 진행할 수 있습니다.
  - 비밀번호 초기화도 등록된 메일로 직접 가능하므로, 가능하면 기능 활성화를 권장합니다.
  - TSBOARD 설치 경로에 `.env` 파일을 열어서 본인의 구글 계정과 앱 비밀번호를 등록해주세요.

> 구글 계정 고객센터에 등록된 이 글을 통해 앱 비밀번호를 어떻게 얻을 수 있는지 확인 하실 수 있습니다. <https://support.google.com/accounts/answer/185833?hl=ko>

### 개발 모드로 실행하기

> 이 안내는 Visual Studio Code (vscode)를 이미 사용해 보신 분들을 대상으로 합니다.

- TSBOARD를 본인의 Linux PC or Mac 에 먼저 설치하여 개발 모드로 사용해 보실 수도 있습니다.
  - `vscode` 를 실행 후 TSBOARD 폴더를 여신 다음, 터미널을 2개 띄웁니다.
  - 먼저 TSBOARD 폴더 내 `tsboard.config.ts` 파일을 열고, `IS_DEVELOPING` 항목을 `true` 로 수정합니다.
  - 터미널을 열고 `npm run dev` 를 실행하여 `vite` 가 TSBOARD의 프론트엔드를 보여줄 수 있도록 합니다.
  - 다른 터미널을 열고 `npm run dev:server` 를 실행하여 TSBOARD의 백엔드를 실행하도록 합니다.
  - 브라우저에서 `http://localhost:3000` 주소로 접속하면 TSBOARD 첫화면을 보실 수 있습니다.

### TSBOARD 업데이트

> 업데이트 전에 기존 TSBOARD는 늘 다른 경로에 백업하는 걸 권장합니다.

- 설치 후 TSBOARD를 업데이트 하고자 할 땐 `git pull` 를 실행하시면 됩니다.
  - `git pull` 진행 시 여러분이 직접 수정하신 파일과, TSBOARD에서 변경된 내용이 충돌날 수 있습니다.
  - 이 때는 본인의 수정 내용과 TSBOARD 변경사항을 직접 `merge` 하셔야 합니다.
  - 변경사항이 많이 따라가기 어려울 때는, 작업하신 내용을 먼저 백업한 이후 하나씩 `merge` 해주세요.

## 설치 후 서버 설정

> TSBOARD는 보안을 위해 SSL 적용을 강력히 권장합니다.

> Ubuntu 22.04에서 Nginx 암호화하기 <https://velog.io/@mero/ubuntu-22.04%EC%97%90%EC%84%9C-Nginx-%EC%95%94%ED%98%B8%ED%99%94%ED%95%98%EA%B8%B0> 혹은 무료 SSL 인증서인 letsencrypt 설치 방법을 검색하신 후 운영하시는 서버에 적용해 보세요.

- 축하합니다! 여러분은 `git clone` → `bun install` → `bun setup.ts` 과정까지 무사히 마쳤습니다.
- 이제 보다 원할한 TSBOARD 활용을 위해, 아래의 추가적인 설정 단계를 진행해 봅시다.

  - 아래 단계에서는 Ubuntu server 에 Nginx 가 설치되어 있는 것으로 가정합니다.
  - Nginx의 설정 파일 내용을 일부 수정해야 합니다. `vi /etc/nginx/sites-enabled/default` 를 실행합니다.
  - `server { ... }` 사이의 내용들을 수정해야 합니다. **TSBOARD가 권장 설치 경로에 설치된 걸로 가정**합니다.
    <br />

  ```
  # /etc/nginx/sites-enabled/default
  #
  # TSBOARD가 권장 설치 경로에 설치되어 있고,
  # 현재 운영중인 웹사이트의 도메인이 tsboard.dev 인걸 가정하고 있습니다.
  # 아울러, tsboard.config.ts 파일의 PORT 부분을 수정하지 않은 걸 가정합니다.
  #
  server {
    root /var/www/tsboard.git/dist; # TSBOARD설치경로/dist

    index index.html index.htm;

    server_name tsboard.dev;

    location /upload {
      root /var/www/tsboard.dev; # TSBOARD설치경로
      try_files $uri $uri/ =404;
    }

    location / {
      try_files $uri $uri/ /index.html; # Vue Router 활용을 위한 설정 (CSR)
    }

    location /api {
      # tsboard.config.ts 에서 PORT.PRODUCTION 값과 아래 3100 이 동일해야 함
      proxy_pass http://127.0.0.1:3100/api;
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

## 설치가 어려운 분들께

### 대신 설치 요청하기

- 먼저 설치 과정에서 어려움을 만나신 분들께 위로를 드립니다.
  - TSBOARD는 사실 설치하기가 쉽지 않습니다. 일반적인 JavaScript/TypeScript 프로젝트라면 보통 Node.js 만 있으면 되지만, CPU도 가려쓰는(...) Bun을 추가로 요구하니까요.
  - 또한 개발 과정의 간소화 내지는 우선순위 조정으로 인해 설치 과정에서 예외 케이스들을 면밀히 검토하지 못했습니다.
  - 앞으로 더 편하게 설치하여 사용하실 수 있도록 더욱 노력하겠습니다.
- TSBOARD 설치를 대신 도와드리겠습니다.
  - 본인이 운영하시는 서버가 있으시고, SSH 접속 권한을 공유해 주실 수 있으시다면 `sirini@gmail.com` 으로 요청 메일을 보내주세요.
  - 단, 앞서 언급한대로 가상 서버나 기타 조건으로 인해 제대로 운영이 안될 수 있으며, 오직 설치만 대신해 드립니다.
  - 기존에 운영하시는 서비스를 TSBOARD로 전환하길 원하시는 분들은 <https://tsboard.dev> 사이트에 관련 내용들을 공유해주세요. (기존에 어떤 게시판을 쓰셨는지, 따로 커스텀 하신 건 있으신지 등...)
- 개발자 지인이 있다면 도움을 요청해보세요.
  - TSBOARD가 사용하는 기술 스택들은 Bun 을 제외한다면 크게 특별하지 않습니다.
  - 주변에 개발자 지인이 있다면, 이 리드미 내용을 공유하면서 설치를 부탁해보세요.
  - 때로는 **정당한 대가를 지불하고 개발자의 시간을 사는 것도 방법**이 될 수 있습니다.

### 문의하러가기

- 설치 과정에서의 어려움을 이겨내고자 하는 여러분들을 응웝합니다!
- 민감한 내용이 포함되어 있다면 `sirini@gmail.com` 으로 문의해주세요.
- 다른 사용자와 어려움을 함께 논의해보고 싶다면 <https://tsboard.dev> 사이트에 와주세요.

---

# TSBOARD 설명

> 아래부터는 알아두면 언젠가 쓸모가 있을수도 있는 내용들입니다.
> 혹시 TSBOARD에 어째서 별도로 스킨을 선택하는 메뉴가 없는지 궁금하신 분들은 3번 커스텀 가이드를 참조해 주세요!

1. 전체 구조
2. 테이블 구조
3. 커스텀 가이드

## 전체 구조

### 프론트엔드

- 프론트엔드는 `Vue`, `Vuetify`, `Vue Router`, `Pinia` 그리고 에디터에 `tiptap` 이 사용됩니다.
- `.vue` 파일에서 UI는 대부분 Vuetify 컴포넌트를 사용하는 걸로 구현되어 있습니다. 대부분 `<v-card>` 처럼 v- 접두사를 가집니다.
- 버튼을 클릭하거나, `.vue` 파일이 브라우저에 붙는 시점에 초기화 작업들을 해야 할때는 Pinia로 정의한 스토어들을 `import` 한 후 필요한 함수들을 사용하도록 구성했습니다. 따라서 대부분의 UI쪽 로직들, 특히 서버쪽에 요청을 보내는 함수들은 `src/store/` 내 파일들을 참조하시면 됩니다.
- 페이지 열람은 항상 Vue Router 기준입니다.
  - 만약 기존에 게시판 목록보기 페이지인 `src/pages/board/List.vue` 을 그대로 둔 상태에서, 다른 디자인의 목록보기 페이지를 예를 들어 `src/pages/somethingNewBoard/AwesomeList.vue` 경로에 만들었다고 합시다.
  - 방문객들이 게시판 목록을 새로 만든 디자인으로 보길 원한다면, 추가로 `src/router/board.ts` 파일을 열어서 `@/pages/board/List.vue` 로 적힌 부분을 모두 `@/pages/somethingNewBoard/AwesomeList.vue` 로 수정해야 합니다.
  - TSBOARD는 Client Side Rendering 방식으로 동작합니다. 따라서 모든 접속 경로는 반드시 `src/router/index.ts` 를 통해 결정됩니다.
- 어쩌면 가장 궁금하실 수 있는 부분인데, TSBOARD는 **Server Side Rendering을 지원하지 않습니다.** 이 선택에 대한 제 나름의 이유들은 아래와 같습니다.
  - TSBOARD 개발 초기부터, 가능하면 서버의 부담을 줄이는 방향으로 개발하고자 했습니다. 브라우저 성능은 계속해서 개선되고 있고, 네트워크도 점점 빨라지면서 이제는 진짜 클라이언트가 좀 더 부담스런 작업들을 많이 해도 괜찮겠다고 생각했었거든요.
  - Server Side Rendering이 SEO에 유리한 건 맞지만, Client Side Rendering이라고 해서 검색이 안된다거나 하진 않습니다. 크롬 브라우저를 개발하는 구글의 검색 봇들이 JavaScript를 실행하지 못할까요? 🧐
  - 처음 방문 시 로딩 속도 관점에서는 분명히 Server Side Rendering이 장점인 건 맞습니다. 하지만 5G 시대에 처음 방문하는 웹사이트의 로딩 속도가 느리다고 해봤자 얼마나 느릴까요? 차라리 서버의 부담을 줄여서 응답속도를 개선하는 게 낫겠다는 생각이었습니다.
  - 렌더링을 클라이언트와 서버 양쪽에 나눠서 할 경우 타이밍이라고 할까요, 즉 언제 객체가 준비되었는지 기다렸다가 작업하거나 혹은 DOM에 접근할 때 어떻게 해야 할지 등을 결정하는 비용이 너무 높았습니다. 일단 혼자서 풀스택을 개발하다보니, 가능하면 단순한 설계와 구조를 유지하고 싶었습니다.
  - 가지고 있는 서버 자원이 거의 전무합니다. <https://tsboard.dev> 사이트는 현재 방구석 한켠에 굴러다니는 주먹만한 미니PC에서 돌아가고 있는데 더 부담을 주고 싶진 않았습니다... 🥲

## 테이블 구조

## 커스텀 가이드
