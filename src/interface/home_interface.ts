import {
  BOARD,
  Board,
  BOARD_CONFIG,
  BOARD_LIST_ITEM,
  BoardConfig,
  BoardListItem,
} from "./board_interface"

export const VISIT_KEY = "tsboardVisit"
export const LANG_KEY = "tsboardLanguage"
export const LANG = {
  KO: 0,
  EN: 1,
  CN: 2,
}
export type HomeLang = 0 | 1 | 2
export type HomeNotice = 0 | 1 | 2 | 3 | 4

// 최근 게시글들 최종 리턴 타입 정의
export type BoardHomePostItem = BoardListItem & {
  id: string
  type: Board
  useCategory: boolean
}

// 최근 게시글들 최종 리턴 타입 및 게시판 정보 정의
export type BoardHomePostResult = {
  items: BoardHomePostItem[]
  config: BoardConfig
}

// 최근 게시글들 최종 리턴 기본값
export const BOARD_HOME_POST_ITEM: BoardHomePostItem = {
  ...BOARD_LIST_ITEM,
  id: "",
  type: BOARD.DEFAULT as Board,
  useCategory: false,
}

// 최근 게시글들 최종 리턴 및 게시판 정보 기본값
export const BOARD_HOME_POST_RESULT: BoardHomePostResult = {
  items: [] as BoardHomePostItem[],
  config: BOARD_CONFIG,
}

// 홈 사이드바에 출력할 게시판 목록 형태 정의
export type HomeSidebarBoardResult = {
  id: string
  type: Board
  name: string
  info: string
}

// 홈 사이드바에 출력할 그룹 목록 형태 정의
export type HomeSidebarGroupResult = {
  group: string
  boards: HomeSidebarBoardResult[]
}
