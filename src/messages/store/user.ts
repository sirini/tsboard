/**
 * messages/store/user
 *
 * 쪽지, 신고, 정보 보기, 회원 관리 (관리자용) 관련 텍스트 모음
 */

export const USER = {
  NO_RESPONSE: "서버로부터 응답을 받을 수 없습니다. 관리자에게 문의해 주세요.",
  INVALID_TEXT_LENGTH: "3글자 이상, 1000자 미만으로 입력해주세요.",
  UNKNOWN_NOTE_TARGET: "쪽지를 보낼 대상이 제대로 지정되지 않았습니다.",
  UNKNOWN_REPORT_TARGET: "신고할 대상이 제대로 지정되지 않았습니다.",
  REPORTED_USER: "님을 운영진에게 신고 하였습니다.",
  ACTION_TAKEN: "님에 대한 조치를 완료 하였습니다.",
  FAILED_MANAGE_USER: "회원에 대한 조치사항을 반영하지 못했습니다.",
  FAILED_LOAD_PERMISSION: "회원에 대한 기존 조치사항을 가져오지 못했습니다.",
  LOADED_PERMISSION: "회원에 대한 기존 조치사항을 성공적으로 불러들였습니다.",
}
