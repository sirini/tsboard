import { Editor } from "@tiptap/vue-3"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useRoute } from "vue-router"
import { TSBOARD } from "../../../tsboard.config"
import { TEXT } from "../../messages/store/board/editor"
import { useHomeStore } from "../home"
import { useAuthStore } from "../user/auth"
import { useUtilStore } from "../util"
import { useBoardViewStore } from "./view"
import { useViewerStore } from "./gallery.viewer"
import axios from "axios"
import {
  BOARD,
  BOARD_CONFIG,
  BoardAttachment,
  BoardConfig,
  EditorConfigResult,
  EditorLoadPostResult,
  EditorTagItem,
  Pair,
  STATUS,
  WRITE_RESULT_FAIL,
} from "../../interface/board_interface"
import { AUTO_SAVE_KEY, AutoSaved } from "../../interface/post_interface"
import { CODE, ResponseData } from "../../interface/util_interface"
import { ADMIN } from "../../messages/store/admin/admin"

export const useBoardEditorStore = defineStore("boardEditor", () => {
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const home = useHomeStore()
  const view = useBoardViewStore()
  const viewer = useViewerStore()
  const confirmWriteCancelDialog = ref<boolean>(false)
  const addImageURLDialog = ref<boolean>(false)
  const addVideoURLDialog = ref<boolean>(false)
  const addTableDialog = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const isEditorMode = ref<boolean>(true)
  const id = ref<string>("")
  const postUid = ref<number>(0)
  const config = ref<BoardConfig>(BOARD_CONFIG)
  const isNotice = ref<boolean>(false)
  const isAdmin = ref<boolean>(false)
  const isSecret = ref<boolean>(false)
  const category = ref<Pair>({ uid: 0, name: "" })
  const categories = ref<Pair[]>([])
  const files = ref<File[]>([])
  const attachedFiles = ref<BoardAttachment[]>([])
  const title = ref<string>("")
  const content = ref<string>("")
  const contentWithSyntax = ref<string>("")
  const contentHTML = ref<string>("")
  const tag = ref<string>("")
  const tags = ref<string[]>([])
  const suggestionTags = ref<EditorTagItem[]>([])
  const textRule = [
    (value: any) => {
      if (value?.length > 1) return true
      return TEXT[home.lang].TOO_SHORT_TEXT
    },
  ]

  // 게시판 설정 가져오기
  async function loadBoardConfig(): Promise<void> {
    id.value = route.params.id as string
    if (id.value.length < 2) {
      util.snack(TEXT[home.lang].NO_BOARD_ID)
      return
    }

    const response = await axios.get(`${TSBOARD.API}/editor/config`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        id: id.value,
      },
    })
    const data = response.data as ResponseData<EditorConfigResult>
    if (!data || data.success === false) {
      if (data.code === CODE.INVALID_TOKEN && (await auth.updateAccessToken()) === true) {
        util.error(ADMIN.NEED_REFRESH)
      }
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_CONFIG} (${data.error})`)
    }
    config.value = data.result.config
    categories.value = data.result.categories
    category.value = categories.value[0]
    isAdmin.value = data.result.isAdmin
  }

  // 게시글 임시 보관하기
  function autoSave(): void {
    let hashtags = ""
    if (tags.value.length > 0) {
      hashtags = tags.value.join(",")
    }
    const saved: AutoSaved = {
      title: title.value,
      contentWithSyntax: contentWithSyntax.value,
      tags: hashtags,
    }
    window.localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saved))
  }

  // 임시 보관된 제목과 내용 불러오기
  function loadAutoSaved(): void {
    const saved = window.localStorage.getItem(AUTO_SAVE_KEY)
    if (!saved) {
      return
    }

    const loaded = JSON.parse(saved) as AutoSaved
    title.value = loaded.title
    content.value = loaded.contentWithSyntax
    contentWithSyntax.value = loaded.contentWithSyntax

    if (loaded.tags.includes(",") === true) {
      tags.value = loaded.tags.split(",")
    }
  }

  // 기존에 작성한 게시글 내용 가져오기 (수정 시)
  async function loadOriginalPost(): Promise<void> {
    if (postUid.value < 1) {
      return
    }

    const response = await axios.get(`${TSBOARD.API}/editor/load/post`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        boardUid: config.value.uid,
        postUid: postUid.value,
      },
    })
    const data = response.data as ResponseData<EditorLoadPostResult>
    if (!data || data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_POST} (${data.error})`)
    }

    category.value = data.result.post.category
    attachedFiles.value = data.result.files
    title.value = util.unescape(data.result.post.title)
    content.value = data.result.post.content.replaceAll("<p><br></p>", "<p>&nbsp;</p>")
    contentWithSyntax.value = data.result.post.content.replaceAll("<p><br></p>", "<p>&nbsp;</p>")
    tags.value = data.result.tags.map((tag: Pair) => tag.name)
    isNotice.value = data.result.post.status === STATUS.NOTICE
    isSecret.value = data.result.post.status === STATUS.SECRET

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

    const response = await axios.get(`${TSBOARD.API}/editor/tag/suggestion`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        tag: encodeURIComponent(tag.value),
        limit: 5,
      },
    })
    const data = response.data as ResponseData<EditorTagItem[]>
    if (!data || data.success === false) {
      return util.snack(`${TEXT[home.lang].FAILED_LOAD_TAGS} (${data.error})`)
    }
    suggestionTags.value = data.result
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

  // 선택된 파일들의 배열 반환
  function getFiles(event: MouseEvent): File[] {
    let result: File[] = []
    const targets = (event?.target as HTMLInputElement).files
    if (targets) {
      let totalSize = 0
      const arr = Array.from(targets)
      for (const f of arr) {
        totalSize += f.size
        if (totalSize > TSBOARD.MAX_UPLOAD_SIZE) {
          util.info(TEXT[home.lang].EXCEED_FILESIZE_LIMIT)
          break
        }
        result.push(f)
      }
    }
    return result
  }

  // 선택한 파일들 목록 보관하기
  function selectAttachmentFiles(event: MouseEvent): void {
    files.value = getFiles(event)
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
    isNotice.value = false
  }

  // 글 작성 or 수정 전에 체크 로직
  function checkBeforeSend(): boolean {
    if (title.value.length < 2) {
      util.error(TEXT[home.lang].TOO_SHORT_TITLE)
      return false
    }
    if (contentWithSyntax.value.length < 3) {
      util.error(TEXT[home.lang].TOO_SHORT_CONTENT)
      return false
    }

    if (files.value.length > 0) {
      let totalSize = 0
      files.value.map((file) => {
        totalSize += file.size
      })
      if (TSBOARD.MAX_UPLOAD_SIZE < totalSize) {
        util.error(
          `${TEXT[home.lang].EXCEED_FILESIZE_LIMIT} (limit: ${util.num(TSBOARD.MAX_UPLOAD_SIZE)})`,
        )
        return false
      }
    }
    return true
  }

  // 작성된 글 저장하기
  async function write(): Promise<number> {
    if (checkBeforeSend() === false) {
      return WRITE_RESULT_FAIL
    }

    window.scrollTo({ top: 0, behavior: "smooth" })
    loading.value = true

    const fd = new FormData()
    fd.append("boardUid", config.value.uid.toString())
    fd.append("isNotice", isNotice.value ? "1" : "0")
    fd.append("isSecret", isSecret.value ? "1" : "0")
    fd.append("categoryUid", category.value.uid.toString())
    fd.append("title", title.value)
    fd.append("content", contentWithSyntax.value)
    fd.append("tags", tags.value.join(","))
    for (const file of files.value) {
      fd.append("attachments[]", file)
    }

    try {
      const response = await axios.post(`${TSBOARD.API}/editor/write`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.user.token}`,
        },
      })
      const data = response.data as ResponseData<number>
      if (!data || data.success === false) {
        util.error(`${TEXT[home.lang].FAILED_WRITE_POST} (${data.error})`)
        return WRITE_RESULT_FAIL
      }

      util.success(TEXT[home.lang].WRITTEN_NEW_POST)
      return data.result
    } finally {
      clearVariables()
    }
  }

  // 글 수정하기
  async function modify(): Promise<number> {
    if (checkBeforeSend() === false) {
      return WRITE_RESULT_FAIL
    }

    window.scrollTo({ top: 0, behavior: "smooth" })
    loading.value = true

    const fd = new FormData()
    fd.append("postUid", postUid.value.toString())
    fd.append("boardUid", config.value.uid.toString())
    fd.append("isNotice", isNotice.value ? "1" : "0")
    fd.append("isSecret", isSecret.value ? "1" : "0")
    fd.append("categoryUid", category.value.uid.toString())
    fd.append("title", title.value)
    fd.append("content", contentWithSyntax.value.replaceAll("<p></p>", "<p><br /></p>"))
    fd.append("tags", tags.value.join(","))
    for (const file of files.value) {
      fd.append("attachments[]", file)
    }

    try {
      const response = await axios.patch(`${TSBOARD.API}/editor/modify`, fd, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      })
      const data = response.data as ResponseData<null>
      if (!data || data.success === false) {
        util.error(`${TEXT[home.lang].FAILED_MODIFY_POST} (${data.error})`)
        return WRITE_RESULT_FAIL
      }

      util.success(TEXT[home.lang].MODIFIED_POST)

      switch (config.value.type) {
        case BOARD.GALLERY:
          viewer.loadPost()
          break
        default:
          view.loadPostView()
      }

      return postUid.value
    } finally {
      clearVariables()
    }
  }

  // 첨부되어 있던 파일 삭제하기
  async function removeAttachedFile(fileUid: number): Promise<void> {
    if (fileUid < 1) {
      return
    }

    const response = await axios.delete(`${TSBOARD.API}/editor/remove/attached`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      params: {
        boardUid: config.value.uid,
        postUid: postUid.value,
        fileUid,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_REMOVE_FILE} (${data.error})`)
    }
    attachedFiles.value = attachedFiles.value.filter(
      (file: BoardAttachment) => file.uid !== fileUid,
    )
    util.success(TEXT[home.lang].REMOVED_FILE)
  }

  // HTML 태그 직접 적용해서 에디터에 넣기
  function applyHTMLContent(editor: Editor): void {
    editor.chain().focus().insertContent(contentHTML.value).run()
    contentHTML.value = ""
    isEditorMode.value = true
  }

  return {
    id,
    config,
    postUid,
    isNotice,
    isSecret,
    isAdmin,
    category,
    categories,
    confirmWriteCancelDialog,
    addImageURLDialog,
    addVideoURLDialog,
    addTableDialog,
    loading,
    isEditorMode,
    files,
    attachedFiles,
    title,
    content,
    contentHTML,
    tag,
    tags,
    textRule,
    suggestionTags,
    loadBoardConfig,
    loadOriginalPost,
    loadAutoSaved,
    autoSave,
    selectCategory,
    getFiles,
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
    applyHTMLContent,
  }
})
