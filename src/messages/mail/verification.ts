/**
 * messages/mail/verification
 *
 * 인증 코드 6자리 입력 요청 메일 내용
 */

import { TSBOARD } from "../../../tsboard.config"

export const VERIFICATION = {
  SUBJECT: `[${TSBOARD.SITE.NAME}] #name#님, 인증 코드를 입력해 주세요.`,
  HTML: `안녕하세요 <strong>#name#</strong>님, ${TSBOARD.SITE.NAME} 입니다.<br />
<br />
회원 가입을 완료하기 위해서 아래의 링크에 인증 코드 6자리를 입력해 주세요!<br />
<br />
<div style="width: 500px; background-color: #f0f0f0; border-radius: 10px; border: 2px solid #ddd; margin-top: 10px; margin-bottom: 10px; padding: 10px; line-height: 170%;">
&middot; 인증 코드 : <strong style="letter-spacing: 5px;">#code#</strong><br />
&middot; 코드 입력 : <a href="${TSBOARD.SITE.URL}${TSBOARD.SITE.TSBOARD_PATH}verify/#uid#" target="_blank">여기를 눌러 위의 인증 코드 입력하기!</a>
</div>
<br />
From <a href="${TSBOARD.SITE.URL}" target="_blank">${TSBOARD.SITE.URL}</a> <span style="color: #888888">&middot; Powered by tsboard.dev</span>`,
}
