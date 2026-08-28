import type { Pair, Search } from "./common"
import type { UserBasicInfo } from "./user"

export type BoardType = 0 | 1 | 2 | 3 | 4 | 9
export const BOARD = { DEFAULT: 0, GALLERY: 1, BLOG: 2, WEBZINE: 3, TRADE: 4 } as const
export type PostStatus = -1 | 0 | 1 | 2
export const STATUS = { REMOVED: -1, NORMAL: 0, NOTICE: 1, SECRET: 2 } as const

export type BoardWriter = UserBasicInfo & { signature: string }
export type BoardActionPoint = { view: number; write: number; comment: number; download: number }
export type BoardActionLevel = BoardActionPoint & { list: number }

export type BoardConfig = {
  uid: number
  id: string
  groupUid: number
  admin: { group: number; board: number }
  type: BoardType
  name: string
  info: string
  rowCount: number
  width: number
  useCategory: boolean
  category: Pair[]
  level: BoardActionLevel
  point: BoardActionPoint
  skinKey: string
}

export type BoardListItem = {
  uid: number
  title: string
  content: string
  submitted: number
  modified: number
  hit: number
  status: PostStatus
  category: Pair
  cover: string
  comment: number
  like: number
  liked: boolean
  writer: BoardWriter
}

export type BoardListResult = {
  totalPostCount: number
  config: BoardConfig
  notices: BoardListItem[]
  posts: BoardListItem[]
  blackList: number[]
  isAdmin: boolean
}

export type BoardThumbnail = { large: string; small: string }
export type BoardExif = {
  make: string
  model: string
  aperture: number
  iso: number
  focalLength: number
  exposure: number
  width: number
  height: number
  date: number
}

export type BoardImage = {
  file: { uid: number }
  thumbnail: BoardThumbnail
  exif: BoardExif
  description: string
}

export type BoardAttachment = Pair & { size: number }
export type WriterLatestBase = {
  board: { id: string; type: BoardType; name: string }
  postUid: number
  like: number
  submitted: number
}
export type WriterLatestPost = WriterLatestBase & { comment: number; title: string }
export type WriterLatestComment = WriterLatestBase & { content: string }
export type WriterLatestContent = { posts: WriterLatestPost[]; comments: WriterLatestComment[] }

export type BoardViewResult = {
  config: BoardConfig
  post: BoardListItem
  images: BoardImage[]
  files: BoardAttachment[]
  tags: Pair[]
  prevPostUid: number
  nextPostUid: number
  writerPosts: WriterLatestPost[]
  writerComments: WriterLatestComment[]
  isAdmin: boolean
}

export type BoardItem = Pair & { id: string; type: BoardType; info: string }
export type BoardListQuery = { id: string; option: Search; keyword: string; page: number }
export type BoardViewQuery = {
  id: string
  postUid: number
  latestLimit: number
  needUpdateHit: boolean
}
export type BoardDraft = {
  boardId: string
  title: string
  content: string
  tags: string[]
  isSecret: boolean
  isNotice: boolean
  categoryUid: number
  trade?: TradeForm
  updatedAt: number
}

export type TradePriceType = 0 | 1 | 2
export type TradeProductCondition = 0 | 1 | 2 | 3 | 4
export type TradeShippingType = 0 | 1 | 2
export type TradeStatus = 0 | 1 | 2 | 3
export type TradeForm = {
  brand: string
  price: number
  priceType: TradePriceType
  currency: string
  productCondition: TradeProductCondition
  location: string
  shippingType: TradeShippingType
}
export type TradeInfo = TradeForm & { uid: number; status: TradeStatus; completed: number }
export type TradeListItem = { post: BoardListItem; trade: TradeInfo }
export type TradeListResult = Omit<BoardListResult, "notices" | "posts"> & {
  notices: TradeListItem[]
  posts: TradeListItem[]
}
export type TradeViewResult = BoardViewResult & { trade: TradeInfo }
