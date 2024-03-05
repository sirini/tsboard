/**
 * messages/store/board/editor
 *
 * 글작성용 에디터에 필요한 텍스트들 모음
 */

export const EDITOR = {
  NO_BOARD_ID: "게시판 ID가 올바르지 않습니다. 잘못된 접근입니다.",
  NO_RESPONSE: "서버로부터 응답을 받을 수 없습니다. 관리자에게 문의해 주세요.",
  FAILED_LOAD_CONFIG: "게시판 설정을 가져올 수 없었습니다. 작성 권한이 없을수도 있습니다.",
  FAILED_UPLOAD_IMAGE: "본문에 추가할 이미지 파일들을 업로드 할 수 없었습니다.",
  FAILED_LOAD_IMAGE: "기존에 업로드한 이미지들을 불러오지 못했습니다.",
  FAILED_REMOVE_IMAGE: "이미지를 삭제하지 못했습니다.",
  REMOVED_IMAGE: "이미지를 삭제하였습니다.",
  EMPTY_IMAGES: "이전 이미지가 더 이상 없습니다.",
  FAILED_LOAD_TAGS: "추천 태그목록을 가져올 수 없었습니다.",
  TOO_SHORT_TEXT: "2글자 이상 입력해 주세요.",
  ALREADY_ADDED_TAG: "이미 추가된 태그입니다.",
  TOO_SHORT_TITLE: "제목은 2글자 이상 입력해 주세요.",
  TOO_SHORT_CONTENT: "글 내용은 3글자 이상 입력해 주세요.",
  WRITTEN_NEW_POST: "글 작성에 성공하였습니다.",
  FAILED_WRITE_POST: "글 작성에 실패하였습니다.",
}
