# TSBOARD

<p align="center">
    <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?&style=for-the-badge&&logoColor=white"/>
    <img src="https://img.shields.io/badge/MySQL-4479A1.svg?&style=for-the-badge&&logoColor=white"/>
    <img src="https://img.shields.io/badge/Bun-000000.svg?&style=for-the-badge&&logoColor=white"/>
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

> TSBOARD는 사용자분들을 위한 자체 커뮤니티를 tsboard.dev 사이트에서 운영하고 있습니다.
> 사용하시면서 궁금한 점, 어려운 점들은 위 사이트에서 편하게 문의해 주시면 됩니다.

---

# TSBOARD 설치
