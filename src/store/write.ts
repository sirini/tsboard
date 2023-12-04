/**
 * store/write.ts
 *
 * 게시판, 갤러리 등에서 공통으로 사용하는 글쓰기의 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"
import { useUtilStore } from "../store/util"

export const useWriteStore = defineStore("write", () => {
  const util = useUtilStore()
  const confirmWriteCancelDialog = ref<boolean>(false)
  const uploadImageDialog = ref<boolean>(false)
  const addImageFromDBDialog = ref<boolean>(false)
  const addImageURLDialog = ref<boolean>(false)
  const addVideoURLDialog = ref<boolean>(false)
  const addTableDialog = ref<boolean>(false)
  const files = ref<File[]>([])
  const limit = ref<number>(parseInt(process.env.MAX_FILE_SIZE || "10247680"))
  const subject = ref<string>("")
  const content = ref<string>("")
  const contentWithSyntax = ref<string>("")
  const tag = ref<string>("")
  const tags = ref<string[]>([])
  const uploadRule = [
    (value: any) => {
      return (
        !value ||
        !value.length ||
        value[0].size < limit.value ||
        `파일 크기는 ${limit.value / 1024}MB 이하여야 합니다.`
      )
    },
  ]
  const textRule = [
    (value: any) => {
      if (value?.length > 1) return true
      return `2글자 이상 입력해 주세요.`
    },
  ]

  // 선택한 파일들을 파일 목록에 담기
  function readSelectedFiles(event: MouseEvent): void {
    files.value = []
    const targets = (event?.target as HTMLInputElement).files
    if (targets) {
      const fileArray = Array.from(targets)
      for (const file of fileArray) {
        files.value.push(file)
      }
    }
  }

  // 태그 자동 완성하기
  const tagSuggestions = ref<string[]>(["photography", "tagSample", "example", "test", "nowar"])
  let tagTimer: any = null
  function updateTagSuggestion(): void {
    clearTimeout(tagTimer)
    tagTimer = setTimeout(async () => {
      tagSuggestions.value = tagSuggestions.value.filter((keyword: string) => {
        return keyword.indexOf(tag.value) > -1
      })
    }, 200)
  }

  // 추천 태그를 클릭하거나 스페이스/콤마 키 입력시 추가하기
  function addTag(value: string): void {
    const target = value.replaceAll(util.filters.nospace, "")
    const duplicate = tags.value.filter((tag: string) => {
      return tag === target
    })
    if (duplicate.length > 0) {
      util.snack(`이미 추가된 태그입니다.`)
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

  // 작성된 글 저장하기
  async function save(id: string): Promise<void> {
    const result = false
    if (subject.value.length < 2) {
      util.alert(`제목은 2글자 이상 입력해 주세요.`, "error")
      return
    }
    if (content.value.length < 3) {
      util.alert(`글 내용은 3글자 이상 입력해 주세요.`, "error")
      return
    }

    // do something
    // content.value 대신 contentWithSyntax.value 사용할 것
    util.alert(`글 작성에 성공 하였습니다.`, "success")

    files.value = []
    subject.value = ""
    content.value = ""
    contentWithSyntax.value = ""
    tag.value = ""
    tags.value = []
  }

  return {
    confirmWriteCancelDialog,
    uploadImageDialog,
    addImageFromDBDialog,
    addImageURLDialog,
    addVideoURLDialog,
    addTableDialog,
    limit,
    files,
    subject,
    content,
    tag,
    tags,
    uploadRule,
    textRule,
    tagSuggestions,
    readSelectedFiles,
    updateTagSuggestion,
    addTag,
    removeTag,
    updateRealHtml,
    openWriteCancelDialog,
    closeWriteCancelDialog,
    save,
  }
})
