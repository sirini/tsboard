/**
 * store/gallery.viewer.ts
 *
 * 뷰어 다이얼로그에서 이미지 대상으로 하는 상호작용 처리
 */
import { defineStore } from "pinia"
import { ref } from "vue"
import { useAuthStore } from "./auth"
import { useUtilStore } from "./util"
import { Position, GridItem } from "../interface/gallery"

export const useViewerStore = defineStore("viewer", () => {
  const auth = useAuthStore()
  const util = useUtilStore()
  const dialog = ref<boolean>(false)
  const isDragging = ref<boolean>(false)
  const startPos = ref<Position>({ x: 0, y: 0 })
  const transPos = ref<Position>({ x: 0, y: 0 })
  const scale = ref<number>(1.0)
  const drawerWidth = ref<number>(400)
  const drawerPosition = ref<"left" | "right">("right")
  const targetDom = "#tsboardViewerPreview"
  const zoomSpeed = 0.25
  const zoomMax = 20.0
  const zoomMin = 0.5
  const images = ref<GridItem[]>([])
  const position = ref<number>(0)
  const textRule = [
    (value: any) => {
      if (value.length > 2) return true
      return "3글자 이상 입력해 주세요"
    }
  ]

  // 사진을 클릭할 때
  function mouseDown(event: MouseEvent): void {
    const target = document.querySelector(targetDom) as HTMLElement
    isDragging.value = true
    startPos.value.x = event.clientX - transPos.value.x
    startPos.value.y = event.clientY - transPos.value.y

    target.ondragstart = function () {
      return false // 브라우저 기본 드래깅 방지
    }
  }

  // 사진 위치 움직이기
  function mouseMove(event: MouseEvent): void {
    if (isDragging.value === false) {
      return
    }
    const target = document.querySelector(targetDom) as HTMLElement
    transPos.value.x = event.clientX - startPos.value.x
    transPos.value.y = event.clientY - startPos.value.y
    target.style.transform = `translate(${transPos.value.x}px, ${transPos.value.y}px) scale(${scale.value})`
  }

  // 사진에서 마우스 클릭이 끝났을 때
  function mouseUp(event: MouseEvent): void {
    isDragging.value = false
  }

  // 마우스 휠로 확대/축소
  function mouseWheel(event: WheelEvent): void {
    event.preventDefault()
    const target = document.querySelector(targetDom) as HTMLElement
    if (event.deltaY > 0) {
      scale.value -= zoomSpeed
    } else {
      scale.value += zoomSpeed
    }
    scale.value = Math.min(zoomMax, Math.max(scale.value, zoomMin))
    target.style.transform = `translate(${transPos.value.x}px, ${transPos.value.y}px) scale(${scale.value})`
  }

  // 사진에서 마우스가 떠날 때
  function mouseLeave(event: MouseEvent): void {
    isDragging.value = false
  }

  // 사진 위치/크기 초기화
  function reset(): void {
    scale.value = 1.0
    startPos.value = { x: 0, y: 0 }
    transPos.value = { x: 0, y: 0 }

    const target = document.querySelector(targetDom) as HTMLElement
    target.style.transform = `translate(0px, 0px) scale(1.0)`
  }

  // 이전 사진 보기
  function prev(): void {
    if (images.value.length === 1) {
      util.snack("사진이 한 장만 있습니다")
      return
    }
    if (position.value === 0) {
      util.snack("첫번째 사진입니다")
      return
    }
    position.value -= 1
  }

  // 다음 사진 보기
  function next(): void {
    if (images.value.length === 1) {
      util.snack("사진이 한 장만 있습니다")
      return
    }
    if (position.value + 1 === images.value.length) {
      util.snack("마지막 사진입니다")
      return 
    }
    position.value += 1
  }

  // 사진들 불러오기
  function load(): void {
    images.value = [
      { uid: 1, writer: { uid: 11, name: "일지매", profile: "/no-profile.png" }, files: [`https://cdn.vuetifyjs.com/images/cards/docks.jpg`], like: 4, reply: 6 },
      { uid: 2, writer: { uid: 11, name: "일지매", profile: "/no-profile.png" }, files: [`https://cdn.vuetifyjs.com/images/cards/hotel.jpg`], like: 3, reply: 1 },
      { uid: 3, writer: { uid: 11, name: "일지매", profile: "/no-profile.png" }, files: [`https://cdn.vuetifyjs.com/images/cards/sunshine.jpg`], like: 4, reply: 3 },
      { uid: 4, writer: { uid: 11, name: "일지매", profile: "/no-profile.png" }, files: [`https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg`], like: 1, reply: 5 },
      { uid: 5, writer: { uid: 11, name: "일지매", profile: "/no-profile.png"}, files: [`https://cdn.vuetifyjs.com/images/cards/sky.jpg`], like: 2, reply: 8 },
    ]
    position.value = 0
  }

  // 댓글 저장하기
  async function save(comment: string): Promise<void> {
    // do something
  }

  return {
    mouseDown,
    mouseMove,
    mouseUp,
    mouseWheel,
    mouseLeave,
    reset,
    prev,
    next,
    load,
    save,
    dialog,
    drawerWidth,
    drawerPosition,
    images,
    position,
    textRule,
  }
})
