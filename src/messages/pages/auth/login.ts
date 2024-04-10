/**
 * messages/pages/auth/my-info
 *
 * language pack
 */

export const TEXT = [
  /* LANG.KO */ {
    TITLE: "로그인",
    INFO: "다시 오신 것을 환영합니다!",
    FILL_EMAIL: "아이디(이메일)를 입력해 주세요.",
    FILL_PASSWORD: "비밀번호를 입력해 주세요.",
    DESCRIPTION: `게시글 및 댓글 작성, 좋아요/쪽지 기능 등은 모두 로그인 후 이용 가능합니다. 
로그인 후 세션 관련 문제가 발생할 시 로그아웃 이후 다시 로그인을 부탁드립니다. 
혹시 비밀번호를 잊으셨을 경우 최초 가입 시 작성하신 아이디(이메일)로 초기화한 비밀번호를 전해드리겠습니다.`,
    RESET_PASSWORD: "비밀번호 초기화",
    SIGNUP: "회원가입",
    LOGIN: "로그인",
    GOOGLE_LOGIN_TOOLTIP: "구글 계정으로 로그인하기",
  },
  /* LANG.EN */ {
    TITLE: "Login",
    INFO: "Welcome back!",
    FILL_EMAIL: "Please enter your ID (email).",
    FILL_PASSWORD: "Please enter your password.",
    DESCRIPTION: `Features such as posting and commenting, liking, and messaging are all available after logging in. 
If you encounter any session-related issues after logging in, please log out and log in again. 
If you've forgotten your password, we will send a reset password to the email address you registered with.`,
    RESET_PASSWORD: "Reset Password",
    SIGNUP: "Sign Up",
    LOGIN: "Login",
    GOOGLE_LOGIN_TOOLTIP: "Sign in with Google",
  },
  /* LANG.CN */ {
    TITLE: "登录",
    INFO: "欢迎回来！",
    FILL_EMAIL: "请输入您的ID（电子邮箱）。",
    FILL_PASSWORD: "请输入您的密码。",
    DESCRIPTION: `登录后可使用发布帖子、评论、点赞和消息等功能。
如果登录后遇到任何与会话相关的问题，请退出登录并重新登录。
如果您忘记了密码，我们将发送重置密码到您注册时使用的电子邮箱地址。`,
    RESET_PASSWORD: "重置密码",
    SIGNUP: "注册",
    LOGIN: "登录",
    GOOGLE_LOGIN_TOOLTIP: "使用谷歌登录",
  },
]
Object.freeze(TEXT)
