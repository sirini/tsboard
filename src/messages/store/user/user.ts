/**
 * messages/store/user/user
 *
 * 신고, 정보 보기, 회원 관리 (관리자용) 관련 텍스트 모음
 */

export const TEXT = [
  /* LANG.KO */ {
    NO_RESPONSE: "서버로부터 응답을 받을 수 없습니다. 관리자에게 문의해 주세요.",
    INVALID_TEXT_LENGTH: "3글자 이상, 1000자 미만으로 입력해주세요.",
    UNKNOWN_REPORT_TARGET: "신고할 대상이 제대로 지정되지 않았습니다.",
    FAILED_REPORT: "신고를 전송하지 못했습니다.",
    REPORTED_USER: "님을 운영진에게 신고 하였습니다.",
    ACTION_TAKEN: "님에 대한 조치를 완료 하였습니다. 곧 창을 닫습니다...",
    FAILED_MANAGE_USER: "회원에 대한 조치사항을 반영하지 못했습니다.",
    FAILED_LOAD_PERMISSION: "회원에 대한 기존 조치사항을 가져오지 못했습니다.",
    LOADED_PERMISSION: "회원에 대한 기존 조치사항을 성공적으로 불러들였습니다.",
    FAILED_LOAD_INFO: "회원 정보를 가져오지 못했습니다.",
  },
  /* LANG.EN */ {
    NO_RESPONSE: "Unable to receive a response from the server. Please contact the administrator.",
    INVALID_TEXT_LENGTH: "Please enter text between 3 and 1000 characters.",
    UNKNOWN_REPORT_TARGET: "The target for reporting has not been properly identified.",
    FAILED_REPORT: "Failed to send the report.",
    REPORTED_USER: " has been reported to the administration.",
    ACTION_TAKEN: "'s case has been dealt with. Closing the window shortly...",
    FAILED_MANAGE_USER: "Failed to apply actions to the user.",
    FAILED_LOAD_PERMISSION: "Failed to retrieve the user's existing permissions.",
    LOADED_PERMISSION: "Successfully loaded the user's existing permissions.",
    FAILED_LOAD_INFO: "Failed to retrieve user information.",
  },
  /* LANG.CN */ {
    NO_RESPONSE: "无法收到服务器的响应。请联系管理员。",
    INVALID_TEXT_LENGTH: "请输入3到1000个字符之间的文本。",
    UNKNOWN_REPORT_TARGET: "报告的目标未被正确识别。",
    FAILED_REPORT: "发送报告失败。",
    REPORTED_USER: "已被报告给管理层。",
    ACTION_TAKEN: "的案件已处理。窗口即将关闭...",
    FAILED_MANAGE_USER: "应用用户操作失败。",
    FAILED_LOAD_PERMISSION: "无法检索用户的现有权限。",
    LOADED_PERMISSION: "成功加载用户的现有权限。",
    FAILED_LOAD_INFO: "无法检索用户信息。",
  },
]
Object.freeze(TEXT)
