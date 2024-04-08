/**
 * messages/store/board/gallery
 *
 * 갤러리에 필요한 텍스트들 모음
 */

export const TEXT = [
  /* LANG.KO */ {
    NO_BOARD_ID: "게시판 ID가 올바르지 않습니다. 잘못된 접근입니다.",
    NO_RESPONSE: "서버로부터 응답을 받을 수 없습니다. 관리자에게 문의해 주세요.",
    FAILED_LOAD_LIST: "사진 목록을 가져오지 못했습니다. 목록을 볼 수 있는 권한이 없을 수 있습니다.",
    FAILED_LOAD_PHOTO: "사진을 가져오지 못했습니다.",
    LAST_PAGE: "마지막 사진들입니다.",
  },
  /* LANG.EN */ {
    NO_BOARD_ID: "The board ID is incorrect. This is an invalid access.",
    NO_RESPONSE: "Unable to receive a response from the server. Please contact the administrator.",
    FAILED_LOAD_LIST: "Failed to load the photo list. You may not have the permission to view it.",
    FAILED_LOAD_PHOTO: "Failed to load the photo.",
    LAST_PAGE: "These are the last photos.",
  },
  /* LANG.CN */ {
    NO_BOARD_ID: "看板ID不正确。这是一次无效的访问。",
    NO_RESPONSE: "无法收到服务器的响应。请联系管理员。",
    FAILED_LOAD_LIST: "加载照片列表失败。您可能没有权限查看。",
    FAILED_LOAD_PHOTO: "加载照片失败。",
    LAST_PAGE: "这些是最后的照片。",
  },
]
Object.freeze(TEXT)
