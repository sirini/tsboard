/**
 * messages/store/admin/group/list
 *
 * 게시판 그룹 목록 > 일반에 필요한 텍스트들 모음
 */

export const LIST = {
  NO_RESPONSE: "서버로부터 응답을 받을 수 없습니다. 관리자에게 문의해 주세요.",
  FAILED_LOAD: "관리자 정보를 확인할 수 없어 서버로부터 데이터를 가져올 수 없었습니다.",
  UNABLE_LOAD_LIST: "게시판 그룹 목록을 가져올 수 없었습니다.",
  LOADED_LIST: "게시판 그룹 목록을 성공적으로 가져왔습니다.",
  TOO_SHORT_GROUP_ID: "그룹 ID는 2글자 이상 입력해 주세요.",
  INVALID_GROUP_ID: "그룹 ID는 영문자, 숫자, _ (밑줄)로만 작성할 수 있습니다.",
  ADDED_NEW_GROUP:
    "새 그룹을 성공적으로 추가 하였습니다. 상세 그룹 수정은 그룹 수정하기 기능을 이용해 주세요.",
  FAILED_CREATE_GROUP: "새 그룹을 생성하지 못했습니다.",
  INVALID_REMOVE_TARGET: "삭제할 그룹이 올바르게 지정되지 않았습니다.",
  FAILED_REMOVE_GROUP: "지정된 그룹을 삭제할 수 없었습니다.",
  REMOVED_GROUP: "그룹을 성공적으로 삭제하였습니다.",
  NO_DUPLICATE_ID: "입력하신 그룹 아이디는 사용 가능합니다.",
  MINIMUM_GROUP_COUNT: "그룹은 최소 1개 이상 존재해야 합니다.",
}
