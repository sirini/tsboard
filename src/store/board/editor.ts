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
import { useHomeStore } from "../home"
import { TEXT } from "../../messages/store/board/editor"
import { useBoardViewStore } from "./view"
import { BOARD_TYPE, BoardConfig, CountPair, Pair, PostFile } from "../../interface/board"
import { BOARD_CONFIG } from "../../../server/database/board/const"
import { SIZE, TSBOARD } from "../../../tsboard.config"

export const useBoardEditorStore = defineStore("boardEditor", () => {
  const client = edenTreaty<App>(TSBOARD.API.URI)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const view = useBoardViewStore()
  const home = useHomeStore()
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
      return TEXT[home.lang].TOO_SHORT_TEXT
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
      util.snack(TEXT[home.lang].NO_BOARD_ID)
      return
    }

    const response = await client.tsapi.board.config.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: id.value,
        userUid: auth.user.uid,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_CONFIG} (${response.data.error})`)
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
    const response = await client.tsapi.board.load.post.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        boardUid: config.value.uid,
        postUid: postUid.value,
        userUid: auth.user.uid,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_POST} (${response.data.error})`)
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    category.value = response.data.result.post.category
    attachedFiles.value = response.data.result.files
    title.value = util.unescape(response.data.result.post.title)
    contentWithSyntax.value = response.data.result.post.content
    content.value = response.data.result.post.content.replaceAll("<br />", "")
    tags.value = response.data.result.tags.map((tag) => tag.name)

    util.snack(TEXT[home.lang].LOADED_ORIGINAL_POST)
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

    const response = await client.tsapi.board.tag.suggestion.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        tag: tag.value,
        limit: 5,
        userUid: auth.user.uid,
      },
    })

    if (!response.data) {
      return util.snack(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_TAGS} (${response.data.error})`)
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
      util.snack(TEXT[home.lang].ALREADY_ADDED_TAG)
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

  // 글 작성 or 수정 전에 체크 로직
  function checkBeforeSend(): boolean {
    if (title.value.length < 2) {
      util.error(TEXT[home.lang].TOO_SHORT_TITLE)
      return false
    }
    if (content.value.length < 3) {
      util.error(TEXT[home.lang].TOO_SHORT_CONTENT)
      return false
    }

    if (files.value.length > 0) {
      let totalSize = 0
      files.value.map((file) => {
        totalSize += file.size
      })
      if (SIZE.MAX_FILE < totalSize) {
        util.error(`${TEXT[home.lang].EXCEED_FILESIZE_LIMIT} (limit: ${util.num(SIZE.MAX_FILE)})`)
        return false
      }
    }
    return true
  }

  // 작성된 글 저장하기
  async function write(): Promise<void> {
    if (checkBeforeSend() === false) {
      return
    }

    loading.value = true
    const response = await client.tsapi.board.write.post({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        userUid: auth.user.uid,
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
      util.error(TEXT[home.lang].NO_RESPONSE)
      return clearVariables()
    }
    if (response.data.success === false) {
      util.error(`${TEXT[home.lang].FAILED_WRITE_POST} (${response.data.error})`)
      return clearVariables()
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    util.success(TEXT[home.lang].WRITTEN_NEW_POST)
    util.go(viewRouteName.value, id.value, response.data.result.postUid)

    clearVariables()
  }

  // 글 수정하기
  async function modify(): Promise<void> {
    if (checkBeforeSend() === false) {
      return
    }

    loading.value = true
    const response = await client.tsapi.board.modify.patch({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        userUid: auth.user.uid,
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
      util.error(TEXT[home.lang].NO_RESPONSE)
      return clearVariables()
    }
    if (response.data.success === false) {
      util.error(`${TEXT[home.lang].FAILED_MODIFY_POST} (${response.data.error})`)
      return clearVariables()
    }
    auth.updateUserToken(response.data.result.newAccessToken)
    util.success(TEXT[home.lang].MODIFIED_POST)
    util.go(viewRouteName.value, id.value, postUid.value)

    clearVariables()
  }

  // 첨부되어 있던 파일 삭제하기
  async function removeAttachedFile(fileUid: number): Promise<void> {
    if (fileUid < 1) {
      return
    }
    const response = await client.tsapi.board.remove.attached.delete({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        boardUid: config.value.uid,
        postUid: postUid.value,
        fileUid,
        userUid: auth.user.uid,
      },
    })

    if (!response.data) {
      return util.error(TEXT[home.lang].NO_RESPONSE)
    }
    if (response.data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_REMOVE_FILE} (${response.data.error})`)
    }
    attachedFiles.value = attachedFiles.value.filter((file) => file.uid !== fileUid)
    util.success(TEXT[home.lang].REMOVED_FILE)
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
