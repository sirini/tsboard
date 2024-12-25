/**
 * messages/mail/verification
 *
 * 인증 코드 6자리 입력 요청 메일 내용
 */

import { TSBOARD } from "../../../tsboard.config"

export const TEXT = [
  /* LANG.KO */ {
    SUBJECT: `[${TSBOARD.SITE.NAME}] #name#님, 인증 코드를 입력해 주세요.`,
    HTML: `안녕하세요 <strong>#name#</strong>님, ${TSBOARD.SITE.NAME} 입니다.<br />
<br />
회원 가입을 완료하기 위해서 아래의 링크에 인증 코드 6자리를 입력해 주세요!<br />
<br />
<div style="width: 500px; background-color: #f0f0f0; border-radius: 10px; border: 2px solid #ddd; margin-top: 10px; margin-bottom: 10px; padding: 10px; line-height: 170%;">
&middot; 인증 코드 : <strong style="letter-spacing: 5px;">#code#</strong><br />
&middot; 코드 입력 : <a href="${TSBOARD.SITE.URL}${TSBOARD.PREFIX}/verify/#uid#" target="_blank">여기를 눌러 위의 인증 코드 입력하기!</a>
</div>
<br />
From <a href="${TSBOARD.SITE.URL}" target="_blank">${TSBOARD.SITE.URL}</a> <span style="color: #888888">&middot; Powered by tsboard.dev</span>`,
  },
  /* LANG.EN */ {
    SUBJECT: `[${TSBOARD.SITE.NAME}] Please enter your verification code, #name#.`,
    HTML: `Hello <strong>#name#</strong>, welcome to ${TSBOARD.SITE.NAME}.<br />
<br />
To complete your registration, please enter the 6-digit verification code at the link below!<br />
<br />

<div style="width: 500px; background-color: #f0f0f0; border-radius: 10px; border: 2px solid #ddd; margin-top: 10px; margin-bottom: 10px; padding: 10px; line-height: 170%;">
&middot; Verification Code: <strong style="letter-spacing: 5px;">#code#</strong><br />
&middot; Enter Code: <a href="${TSBOARD.SITE.URL}${TSBOARD.PREFIX}/verify/#uid#" target="_blank">Click here to enter your verification code!</a>
</div>
<br />
From <a href="${TSBOARD.SITE.URL}" target="_blank">${TSBOARD.SITE.URL}</a> <span style="color: #888888">&middot; Powered by tsboard.dev</span>`,
  },
  /* LANG.CN */ {
    SUBJECT: `[${TSBOARD.SITE.NAME}] 请填写您的验证码，#name#。`,
    HTML: `你好，<strong>#name#</strong>，欢迎来到${TSBOARD.SITE.NAME}。<br />
<br />
为了完成您的注册，请在下面链接中填写6位数验证码！<br />
<br />

<div style="width: 500px; background-color: #f0f0f0; border-radius: 10px; border: 2px solid #ddd; margin-top: 10px; margin-bottom: 10px; padding: 10px; line-height: 170%;">
&middot; 验证码: <strong style="letter-spacing: 5px;">#code#</strong><br />
&middot; 填写验证码: <a href="${TSBOARD.SITE.URL}${TSBOARD.PREFIX}/verify/#uid#" target="_blank">点击这里填写您的验证码！</a>
</div>
<br />
来自 <a href="${TSBOARD.SITE.URL}" target="_blank">${TSBOARD.SITE.URL}</a> <span style="color: #888888">&middot; 由 tsboard.dev 提供技术支持</span>`,
  },
]
