/**
 * messages/store/board/comment
 *
 * 댓글 보기 등에 필요한 텍스트들 모음
 */

export const TEXT = [
  /* LANG.KO */ {
    NO_BOARD_ID: "게시판 ID가 올바르지 않습니다. 잘못된 접근입니다.",
    NO_RESPONSE: "서버로부터 응답을 받을 수 없습니다. 관리자에게 문의해 주세요.",
    FAILED_LOAD_COMMENT: "댓글들을 가져오지 못했습니다. 볼 수 있는 권한이 없을 수 있습니다.",
    BUTTON_REPLY: "기존 댓글에 답글달기",
    BUTTON_MODIFY: "내 댓글 내용 수정하기",
    BUTTON_NEW: "새 댓글 작성하기",
    INFO_REPLY: "기존 댓글에 답글을 답니다. 답글 대상 내용이 작성란에 인용 되었습니다.",
    NEED_LOGIN: "로그인이 필요합니다.",
    SET_MODIFY_TARGET:
      "내가 작성한 댓글 내용을 수정합니다. 기존에 작성된 댓글이 작성란에 복사 되었습니다.",
    RESET_COMMENT_MODE: "새로운 댓글 작성으로 작성란을 초기화합니다.",
    TOO_SHORT_COMMENT: "댓글 내용이 너무 짧습니다. 최소 2글자 이상 입력해 주세요.",
    SAVED_NEW_COMMENT: "새 댓글을 남겼습니다.",
    FAILED_SAVE_COMMENT: "새 댓글을 남길 수 없었습니다.",
    REPLIED_NEW_COMMENT: "답글을 남겼습니다.",
    MODIFIED_COMMENT: "기존 댓글을 수정하였습니다.",
    FAILED_MODIFY_COMMENT: "기존 댓글을 수정할 수 없었습니다.",
    INVALID_REMOVE_TARGET: "삭제할 대상이 지정되지 않았습니다.",
    FAILED_REMOVE_COMMENT: "댓글을 삭제하지 못했습니다.",
    REMOVED_COMMENT: "댓글이 정상적으로 삭제 되었습니다.",
    NOTE_REMOVED_COMMENT: "삭제된 댓글입니다.",
  },
  /* LANG.EN */ {
    NO_BOARD_ID: "The board ID is incorrect. This is an invalid access.",
    NO_RESPONSE: "Unable to receive a response from the server. Please contact the administrator.",
    FAILED_LOAD_COMMENT: "Failed to load comments. You may not have the permission to view them.",
    BUTTON_REPLY: "Reply to an existing comment",
    BUTTON_MODIFY: "Modify my comment",
    BUTTON_NEW: "Write a new comment",
    INFO_REPLY:
      "You are replying to an existing comment. The content of the comment you are replying to has been quoted in the writing area.",
    NEED_LOGIN: "Login is required.",
    SET_MODIFY_TARGET:
      "You are modifying a comment you made. The existing comment has been copied to the writing area.",
    RESET_COMMENT_MODE: "Reset the writing area for a new comment.",
    TOO_SHORT_COMMENT: "The comment is too short. Please enter at least 2 characters.",
    SAVED_NEW_COMMENT: "A new comment has been posted.",
    FAILED_SAVE_COMMENT: "Failed to post a new comment.",
    REPLIED_NEW_COMMENT: "A reply has been posted.",
    MODIFIED_COMMENT: "The existing comment has been modified.",
    FAILED_MODIFY_COMMENT: "Failed to modify the existing comment.",
    INVALID_REMOVE_TARGET: "No target specified for deletion.",
    FAILED_REMOVE_COMMENT: "Failed to delete the comment.",
    REMOVED_COMMENT: "The comment has been successfully deleted.",
    NOTE_REMOVED_COMMENT: "This comment has been deleted.",
  },
]
Object.freeze(TEXT)
