import { defineStore } from "pinia"
import { ref } from "vue"
import {
  TRADE_ITEM,
  Trade,
  TRADE_STATUS,
  TradeItem,
  TradeStatus,
} from "../../interface/trade_interface"
import axios from "axios"
import { useAuthStore } from "../user/auth"
import { TSBOARD } from "../../../tsboard.config"
import { ResponseData } from "../../interface/util_interface"
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
  SHIPPING_TYPES,
  DEAL_STATUS,
  TEXT,
} from "../../messages/pages/board/trade"
import { useUtilStore } from "../util"
import { useHomeStore } from "../home"
import { BoardListItem } from "../../interface/board_interface"

export const useTradeStore = defineStore("trade", () => {
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const items = ref<TradeItem[]>([])
  const item = ref<TradeItem>(TRADE_ITEM)

  // 판매자가 거래 상태 변경하기
  async function changeTradeStatus(postUid: number, newStatus: TradeStatus): Promise<void> {
    if (item.value.status === newStatus) {
      return
    }

    const fd = new FormData()
    fd.append("postUid", postUid.toString())
    fd.append("newStatus", newStatus.toString())

    const response = await axios.patch(`${TSBOARD.API}/trade/update/status`, fd, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = response.data as ResponseData<Trade[]>
    if (!data || data.success === false) {
      util.snack(`${TEXT[home.lang].FAILED_CHANGE_STATUS} (${data.error})`)
      return
    }
    item.value.status = newStatus
    item.value.statusStr = DEAL_STATUS[home.lang][newStatus]
  }

  // 폼 데이터 생성해서 반환
  function getFormData(postUid: number): FormData {
    const fd = new FormData()
    fd.append("postUid", postUid.toString())
    fd.append("brand", item.value.brand)
    fd.append("productCategory", item.value.productCategory.toString())
    fd.append("price", item.value.price.toString())
    fd.append("productCondition", item.value.productCondition.toString())
    fd.append("location", item.value.location)
    fd.append("shippingType", item.value.shippingType.toString())
    fd.append("status", TRADE_STATUS.OPEN.toString())
    return fd
  }

  // 게시글 목록에 대한 거래 관련 내용 가져오기
  async function loadTradeList(posts: BoardListItem[]): Promise<void> {
    const postUids: number[] = []
    posts.map((post) => postUids.push(post.uid))

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

    items.value = []
    for (const d of data.result) {
      items.value.push({
        ...d,
        categoryStr: PRODUCT_CATEGORIES[home.lang][d.productCategory],
        conditionStr: PRODUCT_CONDITIONS[home.lang][d.productCondition],
        shippingStr: SHIPPING_TYPES[home.lang][d.shippingType],
        statusStr: "",
      })
    }
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
    item.value = {
      ...data.result,
      categoryStr: PRODUCT_CATEGORIES[home.lang][data.result.productCategory],
      conditionStr: PRODUCT_CONDITIONS[home.lang][data.result.productCondition],
      shippingStr: SHIPPING_TYPES[home.lang][data.result.shippingType],
      statusStr: DEAL_STATUS[home.lang][data.result.status],
    }
  }

  // 게시글 수정 시점에 거래 관련 내용들도 수정
  async function modify(postUid: number): Promise<void> {
    if (item.value.brand.length < 2) {
      return util.error(TEXT[home.lang].NEED_BRAND)
    }
    if (item.value.price < 0) {
      return util.error(TEXT[home.lang].WRONG_PRICE)
    }
    if (item.value.location.length < 2) {
      return util.error(TEXT[home.lang].NEED_LOCATION)
    }

    const fd = getFormData(postUid)
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

  // 게시글 작성 시점에 거래 관련 내용들도 저장
  async function write(postUid: number): Promise<void> {
    if (item.value.brand.length < 2) {
      return util.error(TEXT[home.lang].NEED_BRAND)
    }
    if (item.value.price < 0) {
      return util.error(TEXT[home.lang].WRONG_PRICE)
    }
    if (item.value.location.length < 2) {
      return util.error(TEXT[home.lang].NEED_LOCATION)
    }

    const fd = getFormData(postUid)
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

  return {
    items,
    item,
    changeTradeStatus,
    loadTradeList,
    loadTradeInfo,
    write,
    modify,
  }
})
