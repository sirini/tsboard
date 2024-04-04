/**
 * messages/store/board/editor
 *
 * 글작성용 에디터에 필요한 텍스트들 모음
 */

export const TEXT = [
  /* LANG.KO */ {
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
    LOADED_ORIGINAL_POST: "작성했던 게시글을 불러들였습니다.",
    FAILED_LOAD_POST: "기존 게시글을 가져오지 못했습니다.",
    FAILED_REMOVE_FILE: "기존에 첨부된 파일을 삭제하지 못했습니다.",
    REMOVED_FILE: "기존에 첨부된 파일의 삭제에 성공하였습니다.",
    FAILED_MODIFY_POST: "기존 게시글을 수정하지 못했습니다.",
    MODIFIED_POST: "기존 게시글 수정에 성공하였습니다.",
    EXCEED_FILESIZE_LIMIT: "허용 가능한 업로드 크기를 초과하였습니다.",
    FILESIZE_TOO_LARGE: "파일 크기는 이보다 더 작아야 합니다: ",
  },
  /* LANG.EN */ {
    NO_BOARD_ID: "The board ID is incorrect. This is an invalid access.",
    NO_RESPONSE: "Unable to receive a response from the server. Please contact the administrator.",
    FAILED_LOAD_CONFIG: "Failed to load board settings. You may not have the permission to write.",
    FAILED_UPLOAD_IMAGE: "Failed to upload images to be added to the content.",
    FAILED_LOAD_IMAGE: "Failed to load previously uploaded images.",
    FAILED_REMOVE_IMAGE: "Failed to delete the image.",
    REMOVED_IMAGE: "The image has been deleted.",
    EMPTY_IMAGES: "There are no more previous images.",
    FAILED_LOAD_TAGS: "Failed to load recommended tags.",
    TOO_SHORT_TEXT: "Please enter at least 2 characters.",
    ALREADY_ADDED_TAG: "This tag has already been added.",
    TOO_SHORT_TITLE: "Please enter a title of at least 2 characters.",
    TOO_SHORT_CONTENT: "Please enter content of at least 3 characters.",
    WRITTEN_NEW_POST: "Successfully created the post.",
    FAILED_WRITE_POST: "Failed to create the post.",
    LOADED_ORIGINAL_POST: "Successfully loaded the original post.",
    FAILED_LOAD_POST: "Failed to load the existing post.",
    FAILED_REMOVE_FILE: "Failed to delete the previously attached file.",
    REMOVED_FILE: "Successfully deleted the previously attached file.",
    FAILED_MODIFY_POST: "Failed to modify the existing post.",
    MODIFIED_POST: "Successfully modified the existing post.",
    EXCEED_FILESIZE_LIMIT: "Exceeded the allowable upload size limit.",
    FILESIZE_TOO_LARGE: "The size of the attachment must be smaller than this: ",
  },
]
Object.freeze(TEXT)
