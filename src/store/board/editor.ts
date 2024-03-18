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
import { BOARD_TYPE, BoardConfig, CountPair, Pair, PostFile } from "../../interface/board"
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
  const isNotice = ref<boolean>(false)
  const category = ref<Pair>({ uid: 0, name: "" })
  const categories = ref<Pair[]>([])
  const files = ref<File[]>([])
  const attachedFiles = ref<PostFile[]>([])
  const title = ref<string>("")
  const content = ref<string>("")
  const contentWithSyntax = ref<string>("")
  const tag = ref<string>("")
  const tags = ref<string[]>([])
  const suggestionTags = ref<CountPair[]>([])
  const viewRouteName = ref<string>("boardView")
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

    if (config.value.type === BOARD_TYPE.GALLERY) {
      viewRouteName.value = "galleryOpen"
    }
  }

  // 기존에 작성한 게시글 내용 가져오기 (수정 시)
  async function loadOriginalPost(): Promise<void> {
    if (postUid.value < 1) {
      return
    }
    const response = await server.api.board.loadpost.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        postUid: postUid.value,
      },
    })

    if (!response.data) {
      util.snack(EDITOR.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.snack(`${EDITOR.FAILED_LOAD_POST} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    category.value = response.data.result.post.category
    attachedFiles.value = response.data.result.files
    title.value = util.unescape(response.data.result.post.title)
    contentWithSyntax.value = response.data.result.post.content
    content.value = response.data.result.post.content.replaceAll("<br />", "")
    tags.value = response.data.result.tags.map((tag) => tag.name)

    util.snack(EDITOR.LOADED_ORIGINAL_POST)
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
    clearVariables()
  }

  // 선택한 파일들 목록 보관하기
  function selectAttachmentFiles(event: MouseEvent): void {
    files.value = util.attachments(event)
  }

  // 글 작성 or 수정 후 변수들 초기화
  function clearVariables(): void {
    loading.value = false
    files.value = []
    attachedFiles.value = []
    title.value = ""
    content.value = ""
    contentWithSyntax.value = ""
    tag.value = ""
    tags.value = []
    postUid.value = 0
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
      isNotice: isNotice.value ? 1 : 0,
      categoryUid: category.value.uid,
      title: title.value,
      content: contentWithSyntax.value,
      attachments: files.value,
      tags: tags.value.join(","),
    })

    if (!response.data) {
      util.error(EDITOR.NO_RESPONSE)
      clearVariables()
      return
    }
    if (response.data.success === false) {
      util.error(`${EDITOR.FAILED_WRITE_POST} (${response.data.error})`)
      clearVariables()
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    util.success(EDITOR.WRITTEN_NEW_POST)
    util.go(viewRouteName.value, id.value, response.data.result.postUid)

    clearVariables()
  }

  // 글 수정하기
  async function modify(): Promise<void> {
    if (title.value.length < 2) {
      util.error(EDITOR.TOO_SHORT_TITLE)
      return
    }
    if (content.value.length < 3) {
      util.error(EDITOR.TOO_SHORT_CONTENT)
      return
    }

    loading.value = true
    const response = await server.api.board.modify.patch({
      $headers: {
        authorization: auth.user.token,
      },
      postUid: postUid.value,
      boardUid: config.value.uid,
      isNotice: isNotice.value ? 1 : 0,
      categoryUid: category.value.uid,
      title: title.value,
      content: contentWithSyntax.value.replaceAll("<p></p>", "<p><br /></p>"),
      attachments: files.value,
      tags: tags.value.join(","),
    })

    if (!response.data) {
      util.error(EDITOR.NO_RESPONSE)
      clearVariables()
      return
    }
    if (response.data.success === false) {
      util.error(`${EDITOR.FAILED_MODIFY_POST} (${response.data.error})`)
      clearVariables()
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    util.success(EDITOR.MODIFIED_POST)
    util.go(viewRouteName.value, id.value, postUid.value)

    clearVariables()
  }

  // 첨부되어 있던 파일 삭제하기
  async function removeAttachedFile(fileUid: number): Promise<void> {
    if (fileUid < 1) {
      return
    }
    const response = await server.api.board.removeattached.delete({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        postUid: postUid.value,
        fileUid,
      },
    })

    if (!response.data) {
      util.error(EDITOR.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      util.error(`${EDITOR.FAILED_REMOVE_FILE} (${response.data.error})`)
      return
    }
    attachedFiles.value = attachedFiles.value.filter((file) => file.uid !== fileUid)
    util.success(EDITOR.REMOVED_FILE)
  }

  return {
    id,
    config,
    postUid,
    isNotice,
    category,
    categories,
    confirmWriteCancelDialog,
    addImageURLDialog,
    addVideoURLDialog,
    addTableDialog,
    loading,
    files,
    attachedFiles,
    title,
    content,
    tag,
    tags,
    textRule,
    suggestionTags,
    loadBoardConfig,
    loadOriginalPost,
    selectCategory,
    selectAttachmentFiles,
    updateTagSuggestion,
    addTag,
    removeTag,
    updateRealHtml,
    openWriteCancelDialog,
    closeWriteCancelDialog,
    write,
    modify,
    removeAttachedFile,
  }
})
