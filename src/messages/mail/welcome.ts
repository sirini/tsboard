/**
 * messages/mail/welcome
 *
 * 인증 완료하고 회원가입 성공 시 환영 메일 내용
 */

import { TSBOARD } from "../../../tsboard.config"

export const TEXT = [
  /* LANG.KO */ {
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
  },
  /* LANG.EN */ {
    SUBJECT: `[${TSBOARD.SITE.NAME}] Welcome to your membership, #name#!`,
    HTML: `Hello <strong>#name#</strong>, welcome to ${TSBOARD.SITE.NAME}.<br />
<br />
Your email verification is complete!<br /> 
You can now log in to the site.<br /> 
<br /> 
We look forward to seeing you often at ${TSBOARD.SITE.NAME}!<br /> 
<br /> 
<br /> 
From <a href="${TSBOARD.SITE.URL}" target="_blank">${TSBOARD.SITE.URL}</a> <span style="color: #888888">&middot; Powered by tsboard.dev</span>`,
  },
  /* LANG.CN */ {
    SUBJECT: `[${TSBOARD.SITE.NAME}] 欢迎加入会员，#name#！`,
    HTML: `你好，<strong>#name#</strong>，欢迎来到${TSBOARD.SITE.NAME}。<br />
<br />
您的邮箱验证已完成！<br /> 
您现在可以登录到网站了。<br /> 
<br /> 
我们期待在${TSBOARD.SITE.NAME}经常见到您！<br /> 
<br /> 
<br /> 
来自 <a href="${TSBOARD.SITE.URL}" target="_blank">${TSBOARD.SITE.URL}</a> <span style="color: #888888">&middot; 由 tsboard.dev 提供技术支持</span>`,
  },
]
