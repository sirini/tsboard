/**
 * messages/mail/welcome
 *
 * 인증 완료하고 회원가입 성공 시 환영 메일 내용
 */

export const WELCOME = {
  SUBJECT: `[${process.env.SITE_NAME}] #name#님의 회원 가입을 환영합니다!`,
  HTML: `안녕하세요 <strong>#name#</strong>님, ${process.env.SITE_NAME} 입니다.<br />
<br />
사용하시는 메일을 통해 인증이 모두 완료되셨습니다!<br />
이제 사이트에서 로그인을 하실 수 있고, 게시글 및 댓글 등도 게시판 사용 권한에 따라서<br />
사용 하실 수 있습니다.<br />
<br />
${process.env.SITE_NAME} 에서 자주 만나뵈었으면 좋겠습니다!<br />
<br />
<br />
From <a href="${process.env.SITE_URL}" target="_blank">${process.env.SITE_URL}</a> <span style="color: #888888">&middot; Powered by tsboard.dev</span>`,
}
