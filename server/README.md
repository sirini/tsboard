# Deprecated Warning

<p align="center">
    <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?&style=for-the-badge&&logoColor=white"/>
    <img src="https://img.shields.io/badge/Bun-000000.svg?&style=for-the-badge&&logoColor=white"/>
    <img src="https://img.shields.io/badge/ElysiaJS-B087FB.svg?&style=for-the-badge&&logoColor=white"/>
</p>

## TSBOARD 백엔드가 교체됩니다 (v1.0.0 이후)

- TSBOARD는 v1.0.0 이전까지 TS/JS 런타임인 `Bun`과 `ElysiaJS` 기반으로 백엔드가 작성되었습니다.
- 그러나, 보다 확장성있는 고성능 백엔드를 개발하여 이 `server/` 이하 경로는 v1.0.0부터 사용하지 않습니다.
  - 새로 작성된 백엔드는 `Go` 언어와 `Fiber` 웹프레임워크 기반으로 완전히 새롭게 작성되었습니다.
  - `tsboard.git` 폴더 최상단 경로에 `.env` 파일이 위치한 곳을 보시면 아래의 실행 파일들이 있습니다.
    - `goapi_linux_x64` : 리눅스에서 실행 가능한 바이너리 파일입니다.
    - `goapi_win_x64.exe` : 윈도우에서 실행 가능한 바이너리 파일입니다.
    - `goapi_mac_arm` : 맥에서 실행 가능한 바이너리 파일입니다. (Apple Silicon 기준)
  - 위 실행 파일 중 본인의 서버 OS에 맞는 것을 실행하시면 됩니다.
    - 서버에 터미널로 원격 접속하시는 경우 `tmux`와 같은 터미널 세션 관리 프로그램으로 실행하시는 걸 권장합니다.
    - 바이너리 파일들의 실행을 위해 서버에 `Go` 언어 툴체인/컴파일러를 따로 설치하실 필요는 없습니다.
- 새로 작성된 백엔드 코드를 필요에 맞게 수정하여 사용하실 수 있습니다.
  - 이 곳에서 코드를 확인하세요: <https://github.com/sirini/goapi>
  - 새로운 백엔드 코드 수정을 위해서는 `Go` 언어 툴체인/컴파일러가 설치되어 있어야 합니다.
  - `Go` 언어에 대해 더 알고 싶으신 분들은 이 곳을 방문해 보세요: <https://go.dev>

## 서버에 미리 설치해둬야 할 것들

- TSBOARD의 새로운 백엔드는 바이너리 파일만 있으면 바로 실행이 가능합니다.
- 그러나, TSBOARD에서 이미지 리사이즈, 파일 형식 변환 등을 사용하기 위해 `libvips`가 필요합니다.
- `libvips`를 사용하시는 서버에 설치하기 위해서는 아래의 안내를 참조해 주세요.
  - 공식 문서: <https://www.libvips.org/install.html>
  - Ubuntu: `sudo apt-get install libvips-dev`
  - Mac: `brew install vips`

> `libvips`가 설치되어 있지 않은 서버에서는 TSBOARD 백엔드 실행이 실패합니다.

---

1. Go언어로 갑니다! (Goodbye, Bun!) <https://tsboard.dev/blog/sirini/38>
2. Go vs Bun, Go 언어는 정말 JS 런타임보다 빠를까? <https://tsboard.dev/blog/sirini/41>
