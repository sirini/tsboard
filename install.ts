/**
 * install.ts
 *
 * 이 파일은 최초 설치 시 단 한 번 실행 필요합니다.
 * 파일 실행은 Bun을 사용합니다. 아래 명령어를 참조하세요.
 * Git clone을 통해 내려받으신 tsboard 폴더로 이동 후,
 *
 * bun install.ts
 *
 * 라고 입력 하시면 실행 됩니다.
 */

console.log(`
 _       _                         _ 
| |_ ___| |__   ___   __ _ _ __ __| |
| __/ __| '_ \\ / _ \\ / _\` | '__/ _\` |
| |_\\__ \\ |_) | (_) | (_| | | | (_| |
 \\__|___/_.__/ \\___/ \\__,_|_|  \\__,_|

v0.8.0 | tsboard.dev | Currently only available in Korean.

✓ 설치 전 폴더 내 .env 파일을 에디터로 열어 아래 내용을 수정하세요!
  • DB_HOST • DB_USER • DB_PASS • DB_DATA • DB_SOCK_PROD

✓ 추가로, 설치 전/후에 언제든지 아래 항목들도 꼭 수정해 주세요!
  • JWT_SECRET_KEY • GMAIL_OAUTH_USER • GMAIL_OAUTH_CLIENT_ID
  • GAMIL_OAUTH_CLIENT_SECRET • GAMIL_OAUTH_REFRESH_TOKEN
  
  [Q] GMAIL_... 항목에는 무엇을 넣어야 하나요?
  [A] .env 파일에 참고) 에 적힌 URL을 브라우저에서 열어 글 내용대로 해보세요!

✓ 설치 과정에서 문제가 생길경우 .env 파일을 먼저 수정했는지 확인해 주시고,
  사용에 어려움이 있으실 경우 tsboard.dev 사이트를 방문해서 문의를 남겨주세요!

`)

let answer = prompt("위의 안내를 확인했으며 .env 파일 수정을 완료하셨나요? (yes/no)") ?? "no"
answer = answer?.toLowerCase()
if (answer !== "yes") {
  console.log(`\n\n설치를 종료합니다.\n다시 실행을 원하시면 bun install.ts 로 실행해 주세요!`)
}
