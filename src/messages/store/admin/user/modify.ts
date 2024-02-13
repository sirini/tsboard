/**
 * messages/store/admin/user/modify
 *
 * 사용자 정보 수정하기에 필요한 텍스트들 모음
 */

export const MODIFY = {
  NO_RESPONSE: "서버로부터 응답을 받을 수 없습니다. 관리자에게 문의해 주세요.",
  FAILED_LOAD:
    "회원 정보를 가져올 수 없었습니다. 관리자 세션이 만료되었을 수 있습니다. 다시 로그인을 해보세요.",
  TOO_SHORT_NAME: "입력하신 이름이 너무 짧습니다. 2글자 이상 입력해주세요.",
  VALID_NAME: "은(는) 사용할 수 있는 이름입니다.",
  DUPLICATED_NAME: "은(는) 이미 사용중인 이름입니다.",
  LOADED_USER: "회원 정보를 성공적으로 불러들였습니다.",
  DIFFERENT_PASSWORD: "입력하신 비밀번호가 서로 다릅니다. 다시 확인해 주세요.",
  UPDATED_USER: "님의 회원 정보를 성공적으로 업데이트 하였습니다.",
  FAILED_UPDATE: "회원 정보를 수정할 수 없었습니다.",
}
