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

## TSBOARD란 무엇인가요?

TSBOARD는 Type Safety BOARD로, TypeScript 언어로 작성된 커뮤니티 빌더입니다.

## 왜 만들었나요?

- 저는 웹 프로그램을 PHP로 시작했고, 제로보드와 그누보드 시절을 겪은 (이제는 아재) 개발자입니다.
- 제 머리 속 마지막 JavaScript 언어에 대한 추억은 jQuery 없으면 쓰레기(...)같은 언어, 정도였습니다.
- 그러나 지속적인 표준안 개선과 Node.js 의 등장, TypeScript 언어에 뒤늦게 반해버렸습니다.
- 그래서 다시 웹 프로그램을 한 번 만들어보고 싶었고, **늘 만들었던 게시판을 TypeScript 언어로만 작성**해보고 싶었습니다.
- 그래서 시작하게 되었습니다.

> (존경하는 우리나라 게시판의 근본, 그누보드가 PHP에서 파이썬으로 업데이트 하는 걸 보고 자극받은 것도 있습니다 😉)

## TSBOARD만의 장점은 무엇인가요?

- TSBOARD는 프론트엔드와 백엔드 모두 TypeScript 언어로 작성되어 **타입 안정성을 보장**합니다.
- 프론트엔드는 Vue 와 Vuetify 로 제작되어 있어 유려하면서도 빠른 UI 개발이 가능합니다.
- JS/TS 런타임으로 Bun, 웹 프레임워크로 Bun 기반의 ElysiaJS를 선택하여 **보다 빠른 동작이 가능**합니다.
- Node.js 기반의 풀스택 개발을 해보신 분들에게는 쉽게 이해되며, 바로 활용 가능한 디자인입니다.
- 중소규모의 커뮤니티 사이트를 제작하는데 필요한 **모든 기능들이 내장**되어 있습니다.

## 그렇다면 단점은 무엇이고 어떻게 개선할 생각인가요?

- TSBOARD는 **백엔드를 Bun에 전적으로 의지**하고 있습니다.
  - Bun은 23년 9월 1.0 버전이 출시되었고, 이후 안정화 단계를 거치고 있습니다.
  - 즉, 아직까지는 크고 작은 문제들이 있습니다.
  - 예를 들어, 가상서버(정확히는 가상 CPU)에서는 Bun이 제대로 동작하지 않습니다.
  - 또한 패키지 관리 기능도 겸하고 있지만, npm 대비 아직 호환성이 떨어집니다.
  - 성능을 위해 Bun 을 선택한만큼, 인내하며 더 안정화 되길 바라고 있습니다.
- TSBOARD는 **프론트엔드를 Vue 와 Vuetify에 전적으로 의지**하고 있습니다.
  - 왜 React나 Svelte를 선택하지 않았냐는 원망 아닌 원망도 겸허히 받아들입니다.
  - Vue 의 간결성과 Single File Component가 마음에 들어 선택하였습니다.
  - 또한, Vuetify의 풍부한 UI 컴포넌트들이 좋아서 선택하게 되었습니다.
  - 즉, 여러분은 이제 Vue 문법과 Vuetify 활용법을 모르실 경우 새로 배우셔야 합니다.
  - 이부분은 제가 아는 선에서 여러분들과 함께 배우며 도움을 드리겠습니다.
- TSBOARD는 **TypeScript 단일 언어로 작성**되어 있습니다.
  - 물론 여전히 HTML과 CSS라는 친구가 남아있습니다만, 더이상 PHP언어는 없습니다.
  - PHP와 달리, TypeScript 는 Transpile 과정이 필요하고, 개발 환경 세팅도 쉽진 않습니다.
  - 개발자 분들은 별 거 아니겠지만, 웹서비스 운영자 입장에서는 쉽지 않은 도전입니다.
  - TypeScript 언어에 대한 애정을 바탕으로, 여러분들과 함께 배우는 자세로 도움을 드리겠습니다.
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
  - 웹호스팅이 아닌, 서버 호스팅의 경우 사용이 가능합니다.
  - 단, 가상 CPU로 운영되는 (보통 저렴한) 가상 서버 서비스에서는 제대로 동작하지 않습니다.
- 독립적인 하드웨어 자원이 있으시거나, 이미 Node.js 기반으로 서비스를 운영해보셨다면 대부분 지원됩니다.

## 미리 알아두어야 할 사항들

- TSBOARD 설치는 대부분 CLI (명령줄 인터페이스)를 통해 진행됩니다.
  - 보통 웹게시판들은 설치 시 .zip 파일을 받아서 압축을 풀고, FTP로 업로드 후 브라우저에서 설치합니다.
  - 그러나, TSBOARD는 SSH 등으로 서버에 직접 접속한 후 `git clone` → `bun setup.ts` 으로 설치합니다.
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

> 이미 Node.js 기반으로 웹프로젝트를 해보신 개발자분들은 필요한 부분만 참조하시면 됩니다.

> 반면, 조금 어렵게 느껴지시는 분들은 차근차근 따라가면서 설치를 진행해 봅시다.

> TSBOARD 설치 과정에 문제가 있거나, 어려움이 있으실 땐 tsboard.dev를 방문해 주세요!

> 도저히 어떻게 해야할지 모르겠다면, **설치가 어려운 분들께** 항목을 읽어주세요.

### Bun 설치

- Bun은 <https://bun.sh/> 사이트에서 Bun은 무엇인지, 어떻게 설치하는지 등을 확인하실 수 있습니다.
  - 먼저, `curl -fsSL https://bun.sh/install | bash` 명령어로 Bun을 설치합니다.
  - 설치 시 패키지 의존성 관련 메시지들이 나올 수 있습니다. (`curl`, `zip` 등) 먼저 설치해주세요.
  - 설치 후 `source .bashrc` 등을 추가적으로 실행해 Bun 환경변수를 등록 후, `bun --help` 를 실행합니다.

### TSBOARD Git clone

- TSBOARD는 별도의 설치 파일들을 제공하지 않으며, Git을 통해 설치 및 업데이트를 제공합니다.
  - 먼저, `git clone https://github.com/sirini/tsboard tsboard.git` 을 실행합니다.
  - 권장하는 설치 경로는 `/var/www/` 하위 경로입니다. `/root/` 는 추천하지 않습니다.
  - 권장 설치 경로에 설치 시 `/var/www/tsboard.git/` 폴더 안에 `setup.ts` 파일이 존재합니다.
