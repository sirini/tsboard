/**
 * messages/store/board/list
 *
 * 게시판 목록보기에 필요한 텍스트들 모음
 */

export const TEXT = [
  /* LANG.KO */ {
    NO_BOARD_ID: "게시판 ID가 올바르지 않습니다. 잘못된 접근입니다.",
    NO_RESPONSE: "서버로부터 응답을 받을 수 없습니다. 관리자에게 문의해 주세요.",
    FAILED_LOAD_LIST:
      "게시글 목록을 가져오지 못했습니다. 목록을 볼 수 있는 권한이 없을 수 있습니다.",
    FIRST_PAGE: "첫 페이지입니다.",
    LAST_PAGE: "마지막 페이지입니다.",
  },
  /* LANG.EN */ {
    NO_BOARD_ID: "The board ID is incorrect. This is an invalid access.",
    NO_RESPONSE: "Unable to receive a response from the server. Please contact the administrator.",
    FAILED_LOAD_LIST: "Failed to load the post list. You may not have the permission to view it.",
    FIRST_PAGE: "This is the first page.",
    LAST_PAGE: "This is the last page.",
  },
  /* LANG.CN */ {
    NO_BOARD_ID: "看板ID不正确。这是一次无效的访问。",
    NO_RESPONSE: "无法收到服务器的响应。请联系管理员。",
    FAILED_LOAD_LIST: "加载帖子列表失败。您可能没有权限查看。",
    FIRST_PAGE: "这是第一页。",
    LAST_PAGE: "这是最后一页。",
  },
]
Object.freeze(TEXT)
