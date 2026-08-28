# 🪶 TSBOARD

<p align="center">
  <img src="https://img.shields.io/github/v/tag/sirini/tsboard?style=flat-square&color=F97316" alt="version">
  <img src="https://img.shields.io/github/license/sirini/tsboard?style=flat-square&color=5D6D7E" alt="license">
  <img src="https://img.shields.io/github/stars/sirini/tsboard?style=flat-square&color=F4D03F" alt="stars">
</p>

TSBOARD는 작은 서버와 사내망에서도 가볍게 운영할 수 있는 SPA 커뮤니티 프런트엔드입니다. Vue 3,
shadcn-vue 스타일 컴포넌트와 [GOAPI](https://github.com/sirini/goapi)를 사용하며, 게시판·사진·블로그·거래
콘텐츠를 Reddit과 같은 하나의 스레드 중심 화면으로 제공합니다.

> 문서 기준: 2026-08-28 · 통합 버전: TSBOARD/GOAPI 1.3.0 · API contract: 1

TSBOARD는 [NUBO](https://github.com/sirini/nubo)의 전신이지만 v1.3.0부터 역할이 분명히 다릅니다. NUBO가
SSR, SEO와 스킨 생태계를 포함한 완성형 커뮤니티 빌더라면, TSBOARD는 고정된 한 가지 UI를 정적 파일로
배포하는 작은 대안입니다. 두 프로젝트는 같은 GOAPI 계약을 사용하지만 서로의 소스나 빌드 결과를 수정하지
않습니다.

## 주요 기능

- Reddit형 홈 피드, 커뮤니티 목록, 게시물 스레드와 중첩 댓글
- 일반 게시판, 갤러리, 블로그, 웹진과 중고거래 데이터 지원
- 글쓰기·수정, Tiptap 3 본문 편집, 이미지 삽입, 첨부파일과 로컬 임시 저장
- HttpOnly 쿠키 로그인, 세션 자동 갱신, 이메일 인증·초대 가입과 OAuth 로그인
- 프로필, 사용자 차단·신고, 알림과 1:1 메시지
- 사용자·게시판·권한·신고·콘텐츠·Resend 단체 메일을 관리하는 대시보드
- 반응형 모바일 UI와 light/dark 테마
- 한국어를 기본으로 제공하며 헤더에서 한국어/영어를 즉시 전환하는 국제화 UI
- 한국어 Pretendard Variable, 영문 Google Sans Flex와 강조용 Oswald를 자체 호스팅

TSBOARD는 의도적으로 다음 기능을 제공하지 않습니다.

- SSR, 서버 컴포넌트, sitemap과 검색엔진 전용 HTML
- 설치·교체 가능한 스킨 또는 NUBO Market
- GOAPI와 다른 독자 백엔드 계약

## NUBO와 선택 기준

| 항목 | TSBOARD 1.3 | NUBO 1.3 |
| --- | --- | --- |
| 렌더링 | Vite SPA, 정적 `dist` | Nuxt SSR/Nitro |
| 웹 프로세스 | 없음. Nginx가 정적 파일 제공 | Node.js 프로세스 필요 |
| UI | 고정 Reddit형 shadcn-vue UI | 기능별 스킨과 Market |
| SEO | 기본 메타데이터만 제공 | SSR, 공개 콘텐츠 색인 고려 |
| 서버 자원 | 작게 유지하기 쉬움 | 더 많은 기능과 런타임 자원 |
| 백엔드 | GOAPI 1.3.0 / contract 1 | GOAPI 1.3.0 / contract 1 |

공개 콘텐츠의 검색 노출과 스킨 교체가 중요하면 NUBO가 맞습니다. 정적 호스팅, 제한된 서버 자원, 사내
커뮤니티처럼 SPA의 단순함이 더 중요한 경우 TSBOARD를 선택할 수 있습니다.

## 실행 구조

| 구성 | 기본값 | 역할 |
| --- | ---: | --- |
| Nginx | `80`, `443` | `dist`와 업로드 파일 제공, `/goapi` 중계 |
| Vite 개발 서버 | `3000` | 개발 중 SPA와 GOAPI 프록시 |
| GOAPI | `127.0.0.1:3003` | DB, 인증, 게시물, 메일과 파일 처리 |
| MySQL/MariaDB | `3306` | 영속 데이터 |

브라우저는 항상 같은 origin의 `/goapi`를 호출합니다. GOAPI 보호 API는 `Authorization` 헤더를 읽으므로
SPA는 로그인 또는 세션 갱신 응답의 액세스 토큰을 메모리에만 보관해 요청에 주입합니다. 새로고침 뒤에는
HttpOnly 갱신 쿠키로 액세스 토큰을 다시 발급받습니다. 인증 토큰은 `localStorage`에 저장하지 않습니다.

## 요구 사항

- Node.js 22.13 이상과 npm
- GOAPI 1.3.0, API contract 1
- MySQL 8 또는 MariaDB
- 운영 환경의 Nginx와 TLS 인증서
- 공식 Ubuntu용 GOAPI를 직접 만들 경우 Docker와 Buildx

GOAPI의 공식 prebuilt 범위는 Ubuntu 22.04 이상 x86-64입니다. CGO와 libvips가 포함되므로 임의의
`go build` 대신 GOAPI 저장소의 고정된 빌드 스크립트를 사용합니다.

## 개발 시작

```bash
git clone https://github.com/sirini/tsboard.git
git clone https://github.com/sirini/goapi.git
cd tsboard
npm ci
cp env.sample .env
```

`.env`의 DB, 관리자와 비밀키 값을 먼저 설정합니다. 실제 운영 DB를 개발 환경에서 사용하지 마세요.

Ubuntu 22.04 호환 GOAPI 런타임은 형제 저장소에서 만듭니다. 아래 구조를 지키면 바이너리에 기록된
`$ORIGIN/../lib` 경로가 번들 libvips를 찾습니다.

```bash
cd ../goapi
./scripts/build-ubuntu22.sh \
  ../tsboard/goapi-runtime/bin/goapi \
  ../tsboard/goapi-runtime/lib \
  ../tsboard/goapi-runtime/licenses/sharp-libvips
cd ../tsboard
./goapi-runtime/bin/goapi install
./goapi-runtime/bin/goapi
```

다른 터미널에서 SPA를 시작합니다.

```bash
npm run dev
```

기본 API는 `http://127.0.0.1:3003`입니다. 이미 실행 중인 원격 개발 API를 프록시하려면 프런트 소스를
바꾸지 않고 다음처럼 지정할 수 있습니다.

```bash
TSBOARD_API_TARGET=https://dev.example.com npm run dev
```

## 설정

### 프런트엔드

[tsboard.config.ts](./tsboard.config.ts)는 공개된 빌드 설정입니다.

| 값 | 설명 |
| --- | --- |
| `version`, `apiContract` | GOAPI와 일치해야 하는 제품·계약 버전 |
| `apiBase` | 브라우저가 호출할 same-origin API 경로 |
| `siteName`, `tagline`, `domain` | 사이트 표시 정보 |
| `uploadLimit` | 에디터가 업로드 전에 검사하는 합계 크기 |
| `oauth` | 로그인 화면에 표시할 제공자 |

비밀키를 이 파일이나 `VITE_*` 변수에 넣지 마세요. Vite가 브라우저 번들에 포함할 수 있습니다.

### GOAPI

[env.sample](./env.sample)은 GOAPI 1.3.0용 템플릿입니다. 핵심 변경 사항은 다음과 같습니다.

- `GOAPI_DOMAIN`, `GOAPI_BASE`, `GOAPI_HOST`를 사용합니다.
- 메일은 Gmail SMTP가 아니라 Resend를 사용합니다.
- `SIGNUP_MODE`는 `verified_email`, `invite_only`, `disabled` 중 하나입니다.
- 실제 업로드 경로 변수 이름은 GOAPI 계약에 따라 `NUBO_UPLOAD_DIR`입니다.
- `JWT_SECRET_KEY`와 `SYNC_SECRET_KEY`는 서로 다른 무작위 값이어야 합니다.

`.env`에는 DB 비밀번호와 API 키가 들어갑니다. Git에 추가하거나 웹 공개 경로에서 내려받을 수 있게 두지
마세요.

## 검증

```bash
npm run format:check
npm run lint
npm test
npm run build
```

실행 중인 서버가 정확한 GOAPI 버전과 응답 구조를 제공하는지도 검사할 수 있습니다.

```bash
npm run contract:check -- https://example.com/goapi
```

검사는 `/version`, 제품 정보, 메뉴, 가입 정책, 첫 게시판과 인증되지 않은 세션 응답을 확인합니다. 관리자
대시보드도 TSBOARD와 GOAPI 버전 또는 API contract가 다르면 경고합니다.

ESLint는 `src`의 파일을 400줄 이하, 함수는 100줄 이하로 제한합니다. 생성 파일인 `package-lock.json`과
설명 문서는 이 소스 코드 제한의 대상이 아닙니다.

## 프로덕션 빌드

```bash
npm ci
npm run format:check
npm run lint
npm test
npm run build
```

`dist`는 Nginx가 직접 제공하는 정적 SPA입니다. Node.js 웹 프로세스나 `npm run preview`를 운영 서버에서
계속 실행하지 않습니다.

```nginx
server {
    server_name example.com;
    root /var/www/tsboard/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /goapi/ {
        proxy_pass http://127.0.0.1:3003/goapi/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /upload/ {
        alias /var/lib/tsboard/upload/;
    }
}
```

`try_files ... /index.html`은 새로고침한 SPA 경로를 Vue Router에 돌려주기 위해 반드시 필요합니다. 비공개
원본 첨부파일은 공개 alias에 두지 말고 GOAPI의 `/board/original` 단기 전송 경로를 사용해야 합니다.
위 예시를 사용한다면 `NUBO_UPLOAD_DIR=/var/lib/tsboard/upload`도 같은 경로로 설정하세요.

### PM2로 GOAPI 실행

GOAPI 런타임과 업로드, `.env`를 교체 가능한 `dist` 밖에 둡니다.

```bash
cd /var/www/tsboard
NUBO_ENV_FILE=/var/www/tsboard/.env \
  pm2 start ./goapi-runtime/bin/goapi --name tsboard-goapi --cwd /var/www/tsboard
pm2 save
```

새 GOAPI를 적용하기 전에는 DB와 업로드를 서버 밖에 백업합니다. 런타임을 임시 경로에서 검증하고 재실행
가능한 migration을 먼저 적용한 뒤 프로세스를 전환합니다.

```bash
NUBO_ENV_FILE="$PWD/.env" ./goapi-runtime/bin/goapi install
pm2 restart tsboard-goapi --update-env
npm run contract:check -- https://example.com/goapi
```

## 안전한 업데이트 순서

```bash
git pull --ff-only
npm ci
npm run format:check && npm run lint && npm test && npm run build
```

1. 현재 DB, 업로드와 `.env`를 별도 위치에 백업합니다.
2. 후보 GOAPI 런타임을 공식 스크립트로 빌드하고 checksum을 기록합니다.
3. 후보 바이너리의 `install`을 실행해 재실행 가능한 migration을 적용합니다.
4. PM2의 GOAPI 실행 경로를 후보로 바꾸고 readiness를 확인합니다.
5. `dist`를 교체하고 `contract:check`와 주요 화면을 확인합니다.
6. 실패하면 이전 정적 빌드와 이전 GOAPI 런타임으로 되돌립니다. 적용된 DB migration은 삭제하지 않습니다.

`git pull`, npm 설치, 프런트 빌드와 프로세스 재시작은 서로 다른 실패 지점입니다. 한 줄 명령으로 묶지
않으면 어느 단계에서 멈췄는지 확인하고 안전하게 복구하기 쉽습니다.

## 프로젝트 구조

```text
src/
├── api/          # GOAPI contract 1 클라이언트
├── components/   # shadcn-vue 스타일 UI와 기능 컴포넌트
├── i18n/         # 한국어·영어 메시지 카탈로그
├── layouts/      # SPA와 관리자 레이아웃
├── lib/          # API 세션, HTML 정화, 포매팅과 테스트
├── pages/        # 홈, 인증, 게시판, 프로필과 관리자 화면
├── router/       # history-mode Vue Router
├── stores/       # Pinia 인증·홈 상태
├── styles/       # Tailwind 4 색상 토큰과 본문 스타일
└── types/        # GOAPI 응답·요청 타입
```

shadcn-vue는 완성된 런타임 패키지가 아니라 프로젝트가 소유하는 컴포넌트 코드 방식으로 사용합니다.
`src/components/ui`를 수정하면 TSBOARD의 고정 UI가 바뀌며 별도 스킨 레이어는 없습니다.

본문 글꼴은 현재 언어에 따라 Pretendard Variable 또는 Google Sans Flex를 사용합니다. 로고와 작은 대문자
레이블에는 Oswald를 적용하며, 모든 woff2를 `src/assets/fonts`에서 제공해 Google Fonts에 런타임 요청을
보내지 않습니다.

## 보안과 데이터

- API 요청은 `credentials: same-origin`으로 갱신 쿠키를 전송하고 메모리의 액세스 토큰을 Bearer 헤더에 넣습니다.
- 401 응답은 한 번의 공유 refresh 요청으로 병합하며, 실패하면 로그인 화면으로 이동합니다.
- 게시물과 댓글 HTML은 DOMPurify로 정화한 뒤 렌더링합니다.
- 외부 링크에는 `noopener noreferrer`를 적용합니다.
- 업로드 크기는 브라우저에서 먼저 확인하지만 최종 권한과 용량 판정은 GOAPI가 수행합니다.
- 운영 DB, `.env`, Resend/OpenAI/Firebase 자격 증명과 원본 업로드는 저장소에 포함하지 않습니다.

보안 문제는 공개 이슈에 비밀값이나 재현 가능한 공격 데이터를 올리지 말고 저장소 소유자에게 비공개로
전달해 주세요.

## 관련 프로젝트

- [NUBO](https://github.com/sirini/nubo): SSR, SEO와 스킨을 포함한 완성형 후속 프로젝트
- [GOAPI](https://github.com/sirini/goapi): TSBOARD와 NUBO가 공유하는 GoFiber 백엔드
- [nubohub.org](https://nubohub.org): NUBO 운영 사이트
- [tsboard.dev](https://tsboard.dev): TSBOARD 운영 사이트

## 라이선스

애플리케이션 코드는 [MIT License](./LICENSE)를 따릅니다. 포함된 글꼴의 라이선스는
`src/assets/fonts/LICENSE-Pretendard.txt`, `OFL-GoogleSansFlex.txt`, `OFL-Oswald.txt`에서 각각 확인할 수
있습니다.
