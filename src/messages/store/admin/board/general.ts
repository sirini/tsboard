/**
 * messages/store/admin/board/general
 *
 * 게시판 관리 > 일반 부분에 필요한 텍스트들 모음
 */

export const GENERAL = {
  NO_RESPONSE: "서버로부터 응답을 받을 수 없습니다. 관리자에게 문의해 주세요.",
  UNKNOWN_INFO: "존재하지 않는 게시판 ID 입니다.",
  CHANGED_GROUP1: "게시판의 소속 그룹을",
  CHANGED_GROUP2: "으로 변경 하였습니다.",
  UNABLE_UPDATE_GROUP: "소속 그룹을 변경할 수 없었습니다.",
  TOO_SHORT_NAME: "게시판 이름이 너무 짧습니다. 2글자 이상 입력해 주세요.",
  CHANGED_NAME1: "게시판 이름을",
  CHANGED_NAME2: "(으)로 변경 하였습니다.",
  UNABLE_UPDATE_BOARD_NAME: "게시판 이름을 변경할 수 없었습니다.",
  UPDATED_INFO: "게시판 설명을 성공적으로 변경 하였습니다.",
  UNABLE_UPDATE_BOARD_INFO: "게시판 설명을 변경할 수 없었습니다.",
  CHANGED_TYPE1: "게시판 타입을",
  CHANGED_TYPE2: "(으)로 변경 하였습니다.",
  UNABLE_CHANGE_TYPE: "게시판 타입을 변경할 수 없었습니다.",
  ROWS_LIMITATION: "게시글은 한 페이지에 1개 이상 100개 이하로만 출력 가능합니다.",
  UNABLE_UPDATE_ROWS: "한 페이지에 보여줄 게시글 갯수를 변경할 수 없었습니다.",
  UPDATED_ROWS: "개씩 한 페이지에서 게시글이 나오도록 변경 하였습니다.",
  WIDTH_LIMITATION: "게시판 최대 너비는 최최소 300 이상, 최대 3000 이하여야 합니다.",
  CHANGED_WIDTH1: "게시판 최대 너비를",
  CHANGED_WIDTH2: "(으)로 지정하였습니다.",
  UNABLE_UPDATE_WIDTH: "게시판 최대 너비를 변경할 수 없었습니다.",
  UNABLE_LOAD_CONFIG: "서버로부터 게시판 설정(일반) 값들을 가져오지 못했습니다.",
  LOADED_CONFIG: "게시판 설정을 성공적으로 불러들였습니다.",
  TOO_SHORT_CATEGORY: "카테고리 이름이 너무 짧습니다. 2글자 이상 입력해 주세요.",
  ADDED_CATEGORY: "카테고리를 추가했습니다.",
  UNABLE_ADD_CATEGORY: "카테고리를 추가할 수 없었습니다.",
  REMOVE_LAST_CATEGORY: "카테고리는 최소 1개 이상 존재해야 합니다.",
  REMOVED_CATEGORY:
    "선택하신 카테고리를 성공적으로 삭제하고, 대상 글들의 카테고리를 기본으로 변경 하였습니다.",
  UNABLE_REMOVE_CATEGORY: "선택하신 카테고리를 삭제할 수 없었습니다.",
}
