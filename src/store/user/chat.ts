/**
 * store/user/chat
 *
 * 사용자간의 1:1 채팅 스토어
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { ChatHistory, ChatItem, INIT_USER_BASIC, UserBasicInfo } from "../../interface/user"
import { useAuthStore } from "./auth"
import { useUtilStore } from "../util"
import { useHomeStore } from "../home"
import { TEXT } from "../../messages/store/user/chat"
import { TSBOARD } from "../../../tsboard.config"

export const useChatStore = defineStore("chat", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const dialog = ref<boolean>(false)
  const list = ref<ChatItem[]>([])
  const history = ref<ChatHistory[]>([])
  const message = ref<string>("")
  const targetUser = ref<UserBasicInfo>(INIT_USER_BASIC)

  // 채팅 목록 불러오기
  async function loadChatList(): Promise<void> {
    if (auth.user.uid < 1) {
      return
    }
    const response = await client.tsapi.user.load.chat.list.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        limit: 10,
        userUid: auth.user.uid,
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
    targetUser.value = INIT_USER_BASIC
    dialog.value = false
  }

  // 상대방과의 이전 채팅 기록 가져오기
  async function loadChatHistory(): Promise<void> {
    if (auth.user.uid < 1) {
      return
    }

    const response = await client.tsapi.user.load.chat.history.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        userUid: targetUser.value.uid,
        limit: 20,
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

    const response = await client.tsapi.user.save.chat.post({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        userUid: auth.user.uid,
      },
      targetUserUid: targetUser.value.uid,
      message: message.value,
    })

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
