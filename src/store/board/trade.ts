import { defineStore } from "pinia"
import { ref } from "vue"
import {
  PRODUCT_CONDITION,
  ProductCondition,
  SHIPPING_TYPE,
  ShippingType,
  TRADE,
  Trade,
  TRADE_STATUS,
  TradeStatus,
} from "../../interface/trade_interface"
import axios from "axios"
import { useAuthStore } from "../user/auth"
import { TSBOARD } from "../../../tsboard.config"
import { ResponseData } from "../../interface/util_interface"
import { TEXT } from "../../messages/pages/board/trade"
import { useUtilStore } from "../util"
import { useHomeStore } from "../home"

export const useTradeStore = defineStore("trade", () => {
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const trades = ref<Trade[]>([])
  const trade = ref<Trade>(TRADE)
  const brand = ref<string>("")
  const category = ref<number>(0)
  const price = ref<number>(0)
  const productCondition = ref<ProductCondition>(PRODUCT_CONDITION.NEVER_USED as ProductCondition)
  const location = ref<string>("")
  const shippingType = ref<ShippingType>(SHIPPING_TYPE.F2F as ShippingType)
  const status = ref<TradeStatus>(TRADE_STATUS.OPEN as TradeStatus)

  // 게시글 목록에 대한 거래 관련 내용 가져오기
  async function loadTradeList(postUids: number[]): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/trade/list`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        postUids: postUids.join(","),
      },
    })
    const data = response.data as ResponseData<Trade[]>
    if (!data || data.success === false) {
      return
    }
    trades.value = data.result
  }

  // 게시글에 대한 거래 정보 가져오기
  async function loadTradeInfo(postUid: number): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/trade/view`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        postUid,
      },
    })
    const data = response.data as ResponseData<Trade>
    if (!data || data.success === false) {
      return
    }
    trade.value = data.result
  }

  // 게시글 작성 시점에 거래 관련 내용들도 저장
  async function write(postUid: number): Promise<void> {
    if (brand.value.length < 2) {
      return util.error(TEXT[home.lang].NEED_BRAND)
    }
    if (price.value < 0) {
      return util.error(TEXT[home.lang].WRONG_PRICE)
    }
    if (location.value.length < 2) {
      return util.error(TEXT[home.lang].NEED_LOCATION)
    }

    const fd = new FormData()
    fd.append("postUid", postUid.toString())
    fd.append("brand", brand.value)
    fd.append("category", category.value.toString())
    fd.append("price", price.value.toString())
    fd.append("productCondition", productCondition.value.toString())
    fd.append("location", location.value)
    fd.append("shippingType", shippingType.value.toString())
    fd.append("status", TRADE_STATUS.OPEN.toString())

    const response = await axios.post(`${TSBOARD.API}/trade/write`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_WRITE} (${data.error})`)
    }
  }

  // 게시글 수정 시점에 거래 관련 내용들도 수정
  async function modify(postUid: number): Promise<void> {
    if (brand.value.length < 2) {
      return util.error(TEXT[home.lang].NEED_BRAND)
    }
    if (price.value < 0) {
      return util.error(TEXT[home.lang].WRONG_PRICE)
    }
    if (location.value.length < 2) {
      return util.error(TEXT[home.lang].NEED_LOCATION)
    }

    const fd = new FormData()
    fd.append("postUid", postUid.toString())
    fd.append("brand", brand.value)
    fd.append("category", category.value.toString())
    fd.append("price", price.value.toString())
    fd.append("productCondition", productCondition.value.toString())
    fd.append("location", location.value)
    fd.append("shippingType", shippingType.value.toString())
    fd.append("status", TRADE_STATUS.OPEN.toString())

    const response = await axios.post(`${TSBOARD.API}/trade/modify`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_MODIFY} (${data.error})`)
    }
  }

  return {
    trades,
    trade,
    brand,
    category,
    price,
    productCondition,
    location,
    shippingType,
    status,
    loadTradeList,
    loadTradeInfo,
    write,
    modify,
  }
})
