import { DEAL_STATUS, PRODUCT_CATEGORIES, PRODUCT_CONDITIONS, SHIPPING_TYPES } from "../messages/pages/board/trade"

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
  productCategory: number
  price: number
  productCondition: ProductCondition
  location: string
  shippingType: ShippingType
  status: TradeStatus
  completed: number
}

// 거래 관련 전체 내용 정의
export type TradeItem = Trade & {
  categoryStr: string
  conditionStr: string
  shippingStr: string
  statusStr: string
}

// 거래 내용 기본값 정의
export const TRADE_ITEM: TradeItem = {
  uid: 0,
  brand: "",
  productCategory: 0,
  price: 0,
  productCondition: PRODUCT_CONDITION.NEVER_USED as ProductCondition,
  location: "",
  shippingType: SHIPPING_TYPE.PARCEL as ShippingType,
  status: TRADE_STATUS.OPEN as TradeStatus,
  completed: 0,
  categoryStr: PRODUCT_CATEGORIES[0][0],
  conditionStr: PRODUCT_CONDITIONS[0][0],
  shippingStr: SHIPPING_TYPES[0][0],
  statusStr: DEAL_STATUS[0][0],
}
