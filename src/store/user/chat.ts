/**
 * store/user/chat
 *
 * 사용자간의 1:1 채팅 스토어
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { ChatHistory, UserBasicInfo } from "../../interface/user"
import { useAuthStore } from "./auth"
import { useUtilStore } from "../util"
import { CHAT } from "../../messages/store/user/chat"

export const useChatStore = defineStore("chat", () => {
  const server = edenTreaty<App>(process.env.API!)
  const auth = useAuthStore()
  const util = useUtilStore()
  const dialog = ref<boolean>(false)
  const history = ref<ChatHistory[]>([])
  const message = ref<string>("")
  const targetUser = ref<UserBasicInfo>({ uid: 0, name: "", profile: "" })

  // 채팅방 열기
  function openDialog(user: UserBasicInfo): void {
    targetUser.value = user
    dialog.value = true

    loadChatHistory()
  }

  // 채팅창 닫기
  function closeDialog(): void {
    targetUser.value = { uid: 0, name: "", profile: "" }
    dialog.value = false
  }

  // 상대방과의 이전 채팅 기록 가져오기
  async function loadChatHistory(): Promise<void> {
    if (auth.user.uid < 1) {
      return
    }

    const response = await server.api.user.load.chathistory.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        userUid: targetUser.value.uid,
        limit: 20,
      },
    })

    if (!response.data) {
      util.error(CHAT.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.error(`${CHAT.FAILED_LOAD_HISTORY} (${response.data.error})`)
      return
    }

    history.value = response.data.result.reverse()
    util.success(CHAT.LOADED_HISTORY)
  }

  // 채팅 메시지 보내기
  async function _send(): Promise<void> {
    if (message.value.length < 1) {
      return
    }

    const response = await server.api.user.savechat.post({
      $headers: {
        authorization: auth.user.token,
      },
      userUid: targetUser.value.uid,
      message: message.value,
    })

    if (!response.data) {
      util.error(CHAT.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.error(`${CHAT.FAILED_ADD_CHAT} (${response.data.error})`)
      return
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
    history,
    message,
    targetUser,
    openDialog,
    closeDialog,
    send,
  }
})
