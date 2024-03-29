/**
 * messages/mail/resetpassword
 *
 * 비밀번호 초기화 메일 내용
 */

import { TSBOARD } from "../../../tsboard.config"

export const RESETPASSWORD = {
  SUBJECT: `[${TSBOARD.SITE.NAME}] 비밀번호 초기화 안내드립니다.`,
  HTML: `${TSBOARD.SITE.NAME} 회원님, 비밀번호 초기화 관련해서 안내드립니다.<br />
<br />
혹시 비밀번호 초기화를 요청하신 적이 없다면, 본 메일을 무시해 주세요!<br />
(아래 제공되는 링크를 클릭하지 마시고, 이 메일은 삭제하시면 됩니다.)<br />
<br />
만약 비밀번호 초기화를 요청하신 게 맞다면, 아래 제공되는 초기화 링크를 통해서<br />
직접 비밀번호를 변경하실 수 있습니다.<br />
<br />
<div style="width: 500px; background-color: #f0f0f0; border-radius: 10px; border: 2px solid #ddd; margin-top: 10px; margin-bottom: 10px; padding: 10px; line-height: 170%;">
&middot; 링크 : <a href="${TSBOARD.SITE.URL}${TSBOARD.SITE.TSBOARD_PATH}changepassword/#uid#/#code#" target="_blank">여기를 눌러 비밀번호 초기화 하기!</a>
</div>
<br />
From <a href="${TSBOARD.SITE.URL}" target="_blank">${TSBOARD.SITE.URL}</a> <span style="color: #888888">&middot; Powered by tsboard.dev</span>`,
  CHAT: `[resetpassword] 비밀번호 초기화 요청 (회원 번호: #fromUid# / 아이디: #email#)
관리 화면에서 비밀번호를 임시로 초기화 해주세요. (${TSBOARD.SITE.URL}${TSBOARD.SITE.TSBOARD_PATH}admin/member/#fromUid#)  
이후 초기화한 비밀번호를 #email# (으)로 전달해 주세요!
`,
}
