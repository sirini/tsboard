/**
 * store/editor
 *
 * 게시판, 갤러리 등에서 공통으로 사용하는 글쓰기의 상태 및 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { useAuthStore } from "../user/auth"
import { useUtilStore } from "../util"
import { EDITOR } from "../../messages/store/board/editor"
import { useBoardViewStore } from "./view"
import { BoardConfig, CountPair, Pair } from "../../interface/board"
import { BOARD_CONFIG } from "../../../server/database/board/const"

export const useBoardEditorStore = defineStore("boardEditor", () => {
  const server = edenTreaty<App>(process.env.API!)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const view = useBoardViewStore()
  const confirmWriteCancelDialog = ref<boolean>(false)
  const addImageURLDialog = ref<boolean>(false)
  const addVideoURLDialog = ref<boolean>(false)
  const addTableDialog = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const id = ref<string>("")
  const postUid = ref<number>(0)
  const config = ref<BoardConfig>(BOARD_CONFIG)
  const category = ref<Pair>({ uid: 0, name: "" })
  const categories = ref<Pair[]>([])
  const files = ref<File[]>([])
  const title = ref<string>("")
  const content = ref<string>("")
  const contentWithSyntax = ref<string>("")
  const tag = ref<string>("")
  const tags = ref<string[]>([])
  const suggestionTags = ref<CountPair[]>([])
  const textRule = [
    (value: any) => {
      if (value?.length > 1) return true
      return EDITOR.TOO_SHORT_TEXT
    },
  ]

  // 게시판 설정 가져오기
  async function loadBoardConfig(): Promise<void> {
    if (view.config.uid > 0) {
      config.value = view.config
      postUid.value = view.postUid
      return
    }

    id.value = route.params.id as string
    if (id.value.length < 2) {
      util.snack(EDITOR.NO_BOARD_ID)
      return
    }

    const response = await server.api.board.config.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: id.value,
      },
    })
    if (!response.data) {
      util.snack(EDITOR.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.snack(`${EDITOR.FAILED_LOAD_CONFIG} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    config.value = response.data.result.config
    categories.value = response.data.result.categories
    category.value = categories.value[0]
  }

  // 카테고리 선택하기
  function selectCategory(cat: Pair): void {
    category.value = cat
  }

  // 태그 자동 완성하기
  async function _updateTagSuggestion(): Promise<void> {
    if (tag.value.length < 3) {
      return
    }

    const response = await server.api.board.tagsuggestion.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        tag: tag.value,
        limit: 5,
      },
    })
    if (!response.data) {
      util.snack(EDITOR.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.snack(`${EDITOR.FAILED_LOAD_TAGS} (${response.data.error})`)
      return
    }
    suggestionTags.value = response.data.result.suggestions
  }
  const updateTagSuggestion = util.debounce(_updateTagSuggestion, 250)

  // 추천 태그를 클릭하거나 스페이스/콤마 키 입력시 추가하기
  function addTag(value: string): void {
    const target = value.replaceAll(util.filters.nospace, "").toLowerCase()
    const duplicate = tags.value.filter((tag: string) => {
      return tag === target
    })
    if (duplicate.length > 0) {
      util.snack(EDITOR.ALREADY_ADDED_TAG)
      tag.value = ""
      return
    }
    if (target.length < 1) {
      return
    }
    tags.value.push(target)
    tag.value = ""
  }

  // 추가한 태그를 다시 삭제하기
  function removeTag(target: string): void {
    tags.value = tags.value.filter((tag: string) => {
      return tag !== target
    })
  }

  // 문법 강조까지 모두 포함된 글 내용 업데이트하기
  function updateRealHtml(html: string): void {
    contentWithSyntax.value = html
  }

  // 글 작성 취소하기 다이얼로그 열기
  function openWriteCancelDialog(): void {
    confirmWriteCancelDialog.value = true
  }

  // 글 작성 취소하기 다이얼로그 닫기
  function closeWriteCancelDialog(): void {
    confirmWriteCancelDialog.value = false
  }

  // 선택한 파일들 목록 보관하기
  function selectAttachmentFiles(event: MouseEvent): void {
    files.value = util.attachments(event)
  }

  // 작성된 글 저장하기
  async function write(): Promise<void> {
    if (title.value.length < 2) {
      util.error(EDITOR.TOO_SHORT_TITLE)
      return
    }
    if (content.value.length < 3) {
      util.error(EDITOR.TOO_SHORT_CONTENT)
      return
    }

    loading.value = true
    const response = await server.api.board.write.post({
      $headers: {
        authorization: auth.user.token,
      },
      boardUid: config.value.uid,
      categoryUid: category.value.uid,
      title: title.value,
      content: contentWithSyntax.value,
      attachments: files.value,
      tags: tags.value,
    })

    if (!response.data) {
      util.error(EDITOR.NO_RESPONSE)
      loading.value = false
      return
    }
    if (response.data.success === false) {
      util.error(`${EDITOR.FAILED_WRITE_POST} (${response.data.error})`)
      loading.value = false
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    util.success(EDITOR.WRITTEN_NEW_POST)

    setTimeout(() => {
      loading.value = false
      util.go("boardView", id.value, response.data.result.postUid)
    }, 3000)

    files.value = []
    title.value = ""
    content.value = ""
    contentWithSyntax.value = ""
    tag.value = ""
    tags.value = []
  }

  return {
    id,
    config,
    postUid,
    category,
    categories,
    confirmWriteCancelDialog,
    addImageURLDialog,
    addVideoURLDialog,
    addTableDialog,
    loading,
    files,
    title,
    content,
    tag,
    tags,
    textRule,
    suggestionTags,
    loadBoardConfig,
    selectCategory,
    selectAttachmentFiles,
    updateTagSuggestion,
    addTag,
    removeTag,
    updateRealHtml,
    openWriteCancelDialog,
    closeWriteCancelDialog,
    write,
  }
})
