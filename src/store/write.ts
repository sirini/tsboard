/**
 * store/write.ts
 *
 * 게시판, 갤러리 등에서 공통으로 사용하는 글쓰기의 상태 및 유틸리티 함수들
 */

import { ref } from "vue"
import { defineStore } from "pinia"

export const useWriteStore = defineStore("write", () => {
  const files = ref<File[]>([])
  const limit = ref<number>(10247680)
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
      return "2글자 이상 입력해 주세요."
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
  function updateTagSuggestion(tag: string): void {
    clearTimeout(tagTimer)
    tagTimer = setTimeout(async () => {
      tagSuggestions.value = tagSuggestions.value.filter((keyword: string) => {
        return keyword.indexOf(tag) > -1
      })
    }, 200)
  }

  // 작성된 글 저장하기
  async function save(subject: string, content: string, files: File[]): Promise<boolean> {
    const result = false
    // do something
    return result
  }

  return {
    limit,
    files,
    uploadRule,
    textRule,
    tagSuggestions,
    readSelectedFiles,
    updateTagSuggestion,
    save,
  }
})
