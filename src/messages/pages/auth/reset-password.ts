/**
 * messages/pages/auth/reset-password
 *
 * language pack
 */

export const TEXT = [
  /* LANG.KO */ {
    TITLE: "비밀번호 초기화",
    INFO: "비밀번호를 잊어버리셨나요?",
    FILL_EMAIL: "본인 아이디(이메일 주소)를 입력해 주세요.",
    DESCRIPTION: `최초 가입 시점에 입력하신 이메일 주소로 초기화된 비밀번호를 발송해 드립니다.
사이트 내에서는 상대방의 아이디(이메일 주소)를 볼 수 없도록 되어 있지만, 혹시
노출된 경우 다른 사용자가 임의로 초기화를 시도 할 수도 있으므로 주의를
부탁드립니다.`,
    LOGIN: "로그인",
    ASK_RESET: "비밀번호 초기화 요청하기",
  },
  /* LANG.EN */ {
    TITLE: "Password Reset",
    INFO: "Forgot your password?",
    FILL_EMAIL: "Please enter your ID (email address).",
    DESCRIPTION: `A reset password will be sent to the email address provided at the time of registration. 
Although the website is designed to keep user IDs (email addresses) private, 
please be cautious as exposure could allow others to attempt unauthorized resets.`,
    LOGIN: "Login",
    ASK_RESET: "Request Password Reset",
  },
]
Object.freeze(TEXT)
