/**
 * messages/mail/resetpassword
 *
 * 비밀번호 초기화 메일 내용
 */

export const RESETPASSWORD = {
  SUBJECT: `[${process.env.SITE_NAME}] 비밀번호 초기화 안내드립니다.`,
  HTML: `${process.env.SITE_NAME} 회원님, 비밀번호 초기화 관련해서 안내드립니다.<br />
<br />
혹시 비밀번호 초기화를 요청하신 적이 없다면, 본 메일을 무시해 주세요!<br />
(아래 제공되는 링크를 클릭하지 마시고, 이 메일은 삭제하시면 됩니다.)<br />
<br />
만약 비밀번호 초기화를 요청하신 게 맞다면, 아래 제공되는 초기화 링크를 통해서<br />
직접 비밀번호를 변경하실 수 있습니다.<br />
<br />
<div style="width: 500px; background-color: #f0f0f0; border-radius: 10px; border: 2px solid #ddd; margin-top: 10px; margin-bottom: 10px; padding: 10px; line-height: 170%;">
&middot; 링크 : <a href="${process.env.SITE_URL}${process.env.SITE_TSBOARD_PATH}changepassword/#uid#/#code#" target="_blank">여기를 눌러 비밀번호 초기화 하기!</a>
</div>
<br />
From <a href="${process.env.SITE_URL}" target="_blank">${process.env.SITE_URL}</a> <span style="color: #888888">&middot; Powered by tsboard.dev</span>`,
}
