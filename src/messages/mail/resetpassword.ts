/**
 * messages/mail/resetpassword
 *
 * 비밀번호 초기화 메일 내용
 */

import { TSBOARD } from "../../../tsboard.config"

export const TEXT = [
  /* LANG.KO */ {
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
&middot; 링크 : <a href="${TSBOARD.SITE.URL}${TSBOARD.PREFIX}/changepassword/#uid#/#code#" target="_blank">여기를 눌러 비밀번호 초기화 하기!</a>
</div>
<br />
From <a href="${TSBOARD.SITE.URL}" target="_blank">${TSBOARD.SITE.URL}</a> <span style="color: #888888">&middot; Powered by tsboard.dev</span>`,
    CHAT: `[resetpassword] 비밀번호 초기화 요청 (회원 번호: #fromUid# / 아이디: #email#)
관리 화면에서 비밀번호를 임시로 초기화 해주세요. (${TSBOARD.SITE.URL}${TSBOARD.PREFIX}/admin/member/#fromUid#)  
이후 초기화한 비밀번호를 #email# (으)로 전달해 주세요!
`,
  },
  /* LANG.EN */ {
    SUBJECT: `[${TSBOARD.SITE.NAME}] Password Reset Instructions`,
    HTML: `${TSBOARD.SITE.NAME} member, here are your instructions for password reset.<br />
<br />
If you did not request a password reset, please ignore this email!<br />
(Do not click on the link provided below, and you may delete this email.)<br />
<br />
If you did request a password reset, you can change your password using the reset link provided below.<br />
<br />

<div style="width: 500px; background-color: #f0f0f0; border-radius: 10px; border: 2px solid #ddd; margin-top: 10px; margin-bottom: 10px; padding: 10px; line-height: 170%;">
&middot; Link : <a href="${TSBOARD.SITE.URL}${TSBOARD.PREFIX}/changepassword/#uid#/#code#" target="_blank">Click here to reset your password!</a>
</div>
<br />
From <a href="${TSBOARD.SITE.URL}" target="_blank">${TSBOARD.SITE.URL}</a> <span style="color: #888888">&middot; Powered by tsboard.dev</span>`,
    CHAT: `[resetpassword] Password reset request (Member ID: #fromUid# / Email: #email#)
Please temporarily reset the password from the admin panel. (${TSBOARD.SITE.URL}${TSBOARD.PREFIX}/admin/member/#fromUid#)  
Then, send the newly reset password to #email#!
`,
  },
  /* LANG.CN */ {
    SUBJECT: `[${TSBOARD.SITE.NAME}] 密码重置说明`,
    HTML: `${TSBOARD.SITE.NAME}会员，以下是您的密码重置说明。<br />
<br />
如果您没有请求密码重置，请忽略此电子邮件！<br />
（请勿点击下面提供的链接，并且您可以删除此电子邮件。）<br />
<br />
如果您确实请求了密码重置，您可以使用下面提供的重置链接来更改密码。<br />
<br />

<div style="width: 500px; background-color: #f0f0f0; border-radius: 10px; border: 2px solid #ddd; margin-top: 10px; margin-bottom: 10px; padding: 10px; line-height: 170%;">
&middot; 链接 : <a href="${TSBOARD.SITE.URL}${TSBOARD.PREFIX}/changepassword/#uid#/#code#" target="_blank">点击此处重置您的密码！</a>
</div>
<br />
来自 <a href="${TSBOARD.SITE.URL}" target="_blank">${TSBOARD.SITE.URL}</a> <span style="color: #888888">&middot; 由 tsboard.dev 提供技术支持</span>`,
    CHAT: `[resetpassword] 密码重置请求 (会员ID: #fromUid# / 电子邮箱: #email#)
请暂时从管理面板重置密码。 (${TSBOARD.SITE.URL}${TSBOARD.PREFIX}/admin/member/#fromUid#)  
然后，将新重置的密码发送给 #email#！
`,
  },
]
