export const TEXT = [
  /* LANG.KO */
  {
    NEED_BRAND: "판매하려는 제품의 브랜드명을 입력해 주세요. (예: 삼성전자)",
    WRONG_PRICE: "판매 금액은 0원 이상이어야 합니다.",
    NEED_LOCATION:
      "직거래 시 대략적으로 거래 가능한 지역명 혹은 특정 장소를 입력해 주세요. (예: 서울 시청)",
    FAILED_WRITE: "물품 등록에 실패 하였습니다.",
    FAILED_MODIFY: "물품 정보를 수정하지 못했습니다.",
    FORM_BRAND: "제조사 이름을 입력해 주세요. (예: 애플)",
    FORM_PRICE: "생각하시는 판매 가격을 숫자로 입력해 주세요.",
    FORM_LOCATION: "거래를 희망하는 장소나 동네 이름을 입력해 주세요.",
    WARNING:
      "정직한 거래를 위해 허위 매물 및 가품 판매를 금지합니다. 물품의 상태를 상세히 알 수 있도록 스크래치 등을 자세히 촬영해서 사진으로 첨부해 주세요. 회원 간에 안전하고 즐거운 물품 거래가 될 수 있도록 도와주시고, 거래가 완료되면 거래 상태를 완료로 변경 부탁드립니다.",
  },
  /* LANG.EN */
  {
    NEED_BRAND:
      "Please enter the brand name of the product you want to sell. (e.g., Samsung Electronics)",
    WRONG_PRICE: "The selling price must be at least 0 won.",
    NEED_LOCATION:
      "For direct transactions, please enter an approximate area or a specific location where the transaction can take place. (e.g., Seoul City Hall)",
    FAILED_WRITE: "Failed to register the item.",
    FAILED_MODIFY: "Failed to modify the item information.",
    FORM_BRAND: "Please enter the brand name of the product. (e.g., Apple)",
    FORM_PRICE: "Please enter the selling price as a number.",
    FORM_LOCATION: "Please enter the location or neighborhood where you wish to transact.",
    WARNING:
      "For an honest transaction, the posting of fraudulent listings and counterfeit items is prohibited. Please attach photos that clearly show any scratches or imperfections to accurately represent the item's condition. Help ensure a safe and enjoyable transaction between members, and kindly update the transaction status to 'Completed' once the deal is finished.",
  },
  /* LANG.CN */
  {
    NEED_BRAND: "请填写您要销售的产品品牌名称。（例如：三星电子）",
    WRONG_PRICE: "销售价格必须不低于 0 韩元。",
    NEED_LOCATION: "在直接交易时，请输入大致可进行交易的区域名称或具体地点。（例如：首尔市政厅）",
    FAILED_WRITE: "商品注册失败。",
    FAILED_MODIFY: "未能修改商品信息。",
    FORM_BRAND: "请填写您要销售的产品品牌名称。（例如：苹果）",
    FORM_PRICE: "请以数字形式输入您期望的销售价格。",
    FORM_LOCATION: "请输入您希望交易的地点或社区名称。",
    WARNING:
      "为了诚实交易，禁止发布虚假商品信息和销售假货。请附上能够清晰展示划痕等瑕疵的照片，以准确呈现物品状况。请帮助确保会员之间的安全愉快交易，并在交易完成后将交易状态更改为‘已完成’。",
  },
]

// 물품 상태 기본값을 언어별로 정의
export const PRODUCT_CONDITION_NAME = [
  ["미개봉", "최상급", "사용감", "동작함", "부서짐"],
  ["Unopened", "Excellent", "Signs of use", "Functional", "Broken"],
  ["未开封", "极佳", "有使用痕迹", "可正常使用", "损坏"],
]

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

// 배송 타입 기본값을 언어별로 정의
export const SHIPPING_TYPE_NAME = [
  ["택배", "직거래"],
  ["Shipping", "Face-to-Face"],
  ["快递", "当面交易"],
]

Object.freeze(TEXT)
Object.freeze(PRODUCT_CONDITION_NAME)
Object.freeze(PRODUCT_CATEGORIES)
Object.freeze(SHIPPING_TYPE_NAME)
