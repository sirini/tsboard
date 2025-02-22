// 물품 상태 정의
export type ProductCondition = 0 | 1 | 2 | 3 | 4

// 물품 상태 기본값
export const PRODUCT_CONDITION = {
  NEVER_USED: 0,
  GREAT: 1,
  GOOD: 2,
  BAD: 3,
  BROKEN: 4,
}

// 물품 카테고리명을 언어별로 정의 (인덱스가 곧 값)
export const PRODUCT_CATEGORIES = [
  /* LANG.KO */
  [
    "전자기기",
    "가구/인테리어",
    "유아용품",
    "여성패션",
    "남성패션",
    "생활가전",
    "주방용품",
    "스포츠",
    "게임",
    "취미",
    "음반",
    "화장품",
    "식물",
    "가공식품",
    "반려동물 용품",
    "티켓/교환권",
    "도서",
  ],
  /* LANG.EN */
  [
    "Electronics",
    "Furniture/Interior",
    "Baby Products",
    "Women's Fashion",
    "Men's Fashion",
    "Home Appliances",
    "Kitchen Supplies",
    "Sports",
    "Games",
    "Hobbies",
    "Music Albums",
    "Cosmetics",
    "Plants",
    "Processed Foods",
    "Pet Supplies",
    "Tickets/Vouchers",
    "Books",
  ],
  /* LANG.CN */
  [
    "电子产品",
    "家具/室内装饰",
    "婴儿用品",
    "女士时尚",
    "男士时尚",
    "家用电器",
    "厨房用品",
    "运动",
    "游戏",
    "爱好",
    "音乐专辑",
    "化妆品",
    "植物",
    "加工食品",
    "宠物用品",
    "票券/兑换券",
    "图书",
  ],
]

// 배송 타입 정의
export type ShippingType = 0 | 1

// 배송 타입 기본값
export const SHIPPING_TYPE = {
  PARCEL: 0,
  F2F: 1,
}

// 거래 상태 정의
export type TradeStatus = 0 | 1 | 2 | 3

// 거래 상태 기본값
export const TRADE_STATUS = {
  OPEN: 0,
  IN_PROGRESS: 1,
  DONE: 2,
  NOT_AVAILABLE: 3,
}

// 거래 관련 내용 정의
export type Trade = {
  uid: number
  brand: string
  category: number
  price: number
  productCondition: ProductCondition
  location: string
  shippingType: ShippingType
  status: TradeStatus
  completed: number
  favorites: number
  favorited: boolean
}

// 거래 내용 기본값 정의
export const TRADE: Trade = {
  uid: 0,
  brand: "",
  category: 0,
  price: 0,
  productCondition: PRODUCT_CONDITION.NEVER_USED as ProductCondition,
  location: "",
  shippingType: SHIPPING_TYPE.F2F as ShippingType,
  status: TRADE_STATUS.OPEN as TradeStatus,
  completed: 0,
  favorites: 0,
  favorited: false,
}
