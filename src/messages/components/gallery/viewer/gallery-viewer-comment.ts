/**
 * messages/components/gallery/viewer/gallery-viewer-comment
 *
 * language pack
 */

export const TEXT = [
  /* LANG.KO */ {
    LIKE_TOOLTIP: "이 댓글에 좋아요를 표시합니다",
    REPLY_TOOLTIP: "이 댓글에 답글을 작성합니다",
    MODIFY_TOOLTIP: "댓글 내용을 수정합니다 (작성자/관리자만 가능)",
    REMOVE_TOOLTIP: "댓글을 삭제합니다 (답글이 달려있을 경우 삭제 불가, 작성자/관리자만 가능)",
  },
  /* LANG.EN */ {
    LIKE_TOOLTIP: "Like this comment",
    REPLY_TOOLTIP: "Reply to this comment",
    MODIFY_TOOLTIP: "Edit this comment (only for the author/admin)",
    REMOVE_TOOLTIP:
      "Delete this comment (cannot be deleted if there are replies, only for the author/admin)",
  },
  /* LANG.CN */ {
    LIKE_TOOLTIP: "喜欢这条评论",
    REPLY_TOOLTIP: "回复此评论",
    MODIFY_TOOLTIP: "编辑此评论（仅限作者/管理员）",
    REMOVE_TOOLTIP: "删除此评论（如果有回复则无法删除，仅限作者/管理员）",
  },
]
Object.freeze(TEXT)
