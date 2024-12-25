import { defineStore } from "pinia"
import { ref } from "vue"
import { TSBOARD } from "../../../tsboard.config"
import { TEXT } from "../../messages/store/user/chat"
import { useHomeStore } from "../home"
import { useUtilStore } from "../util"
import { useAuthStore } from "./auth"
import axios from "axios"
import { ChatHistory, ChatItem } from "../../interface/chat_interface"
import { USER_BASIC_INFO, UserBasicInfo } from "../../interface/user_interface"

export const useChatStore = defineStore("chat", () => {
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const dialog = ref<boolean>(false)
  const list = ref<ChatItem[]>([])
  const history = ref<ChatHistory[]>([])
  const message = ref<string>("")
  const targetUser = ref<UserBasicInfo>(USER_BASIC_INFO)

  // 채팅 목록 불러오기
  async function loadChatList(): Promise<void> {
    if (auth.user.uid < 1) {
      return
    }

    const response = await axios.get(`${TSBOARD.API}/chat/list`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        limit: 10,
      },
    })

    if (response.data && response.data.success === true) {
      list.value = response.data.result
    }
  }

  // 채팅방 열기
  function openDialog(user: UserBasicInfo): void {
    targetUser.value = user
    dialog.value = true

    loadChatHistory()
  }

  // 채팅창 닫기
  function closeDialog(): void {
    targetUser.value = USER_BASIC_INFO
    dialog.value = false
  }

  // 상대방과의 이전 채팅 기록 가져오기
  async function loadChatHistory(): Promise<void> {
    if (auth.user.uid < 1) {
      return
    }

    const response = await axios.get(`${TSBOARD.API}/chat/history`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        limit: 20,
        targetUserUid: targetUser.value.uid,
      },
    })

    if (!response.data) {
      return util.error(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_LOAD_HISTORY} (${response.data.error})`)
    }

    history.value = response.data.result.reverse()
    util.success(TEXT[home.lang].LOADED_HISTORY)
  }

  // 채팅 메시지 보내기
  async function _send(): Promise<void> {
    if (message.value.length < 1) {
      return
    }

    const fd = new FormData()
    fd.append("targetUserUid", targetUser.value.uid.toString())
    fd.append("message", message.value)

    const response = await axios.post(
      `${TSBOARD.API}/chat/save`, fd,
      {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      },
    )

    if (!response.data) {
      return util.error(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_ADD_CHAT} (${response.data.error})`)
    }

    history.value.push({
      uid: response.data.result,
      userUid: auth.user.uid,
      message: message.value,
      timestamp: Date.now(),
    })

    message.value = ""
  }
  const send = util.debounce(_send, 250)

  return {
    dialog,
    list,
    history,
    message,
    targetUser,
    loadChatList,
    openDialog,
    closeDialog,
    send,
  }
})
