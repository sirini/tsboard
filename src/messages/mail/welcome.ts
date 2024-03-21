/**
 * messages/mail/welcome
 *
 * 인증 완료하고 회원가입 성공 시 환영 메일 내용
 */

import { TSBOARD } from "../../../tsboard.config"

export const WELCOME = {
  SUBJECT: `[${TSBOARD.SITE.NAME}] #name#님의 회원 가입을 환영합니다!`,
  HTML: `안녕하세요 <strong>#name#</strong>님, ${TSBOARD.SITE.NAME} 입니다.<br />
<br />
사용하시는 메일을 통해 인증이 모두 완료되셨습니다!<br />
이제 사이트에서 로그인을 하실 수 있습니다.<br />
<br />
${TSBOARD.SITE.NAME} 에서 자주 만나뵈었으면 좋겠습니다!<br />
<br />
<br />
From <a href="${TSBOARD.SITE.URL}" target="_blank">${TSBOARD.SITE.URL}</a> <span style="color: #888888">&middot; Powered by tsboard.dev</span>`,
}
