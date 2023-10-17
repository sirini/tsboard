/**
 * store/gallery.viewer.ts
 *
 * 뷰어 다이얼로그에서 이미지 대상으로 하는 상호작용 처리
 */
import { defineStore } from "pinia"
import { ref } from "vue"

export interface Position {
  x: number
  y: number
}

export const useViewerStore = defineStore("viewer", () => {
  const isDragging = ref<boolean>(false)
  const startPos = ref<Position>({ x: 0, y: 0 })
  const transPos = ref<Position>({ x: 0, y: 0 })
  const scale = ref<number>(1.0)
  const targetDom = "#tsboardViewerPreview"
  const zoomSpeed = 0.25
  const zoomMax = 20.0
  const zoomMin = 0.5

  function mouseDown(event: MouseEvent): void {
    const target = document.querySelector(targetDom) as HTMLElement
    isDragging.value = true
    startPos.value.x = event.clientX - transPos.value.x
    startPos.value.y = event.clientY - transPos.value.y

    target.ondragstart = function () {
      return false // 브라우저 기본 드래깅 방지
    }
  }

  function mouseMove(event: MouseEvent): void {
    if (isDragging.value === false) {
      return
    }
    const target = document.querySelector(targetDom) as HTMLElement
    transPos.value.x = event.clientX - startPos.value.x
    transPos.value.y = event.clientY - startPos.value.y
    target.style.transform = `translate(${transPos.value.x}px, ${transPos.value.y}px) scale(${scale.value})`
  }

  function mouseUp(event: MouseEvent): void {
    isDragging.value = false
  }

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

  function mouseLeave(event: MouseEvent): void {
    isDragging.value = false
  }

  function reset(): void {
    scale.value = 1.0
    startPos.value = { x: 0, y: 0 }
    transPos.value = { x: 0, y: 0 }

    const target = document.querySelector(targetDom) as HTMLElement
    target.style.transform = `translate(0px, 0px) scale(1.0)`
  }

  return {
    mouseDown,
    mouseMove,
    mouseUp,
    mouseWheel,
    mouseLeave,
    reset,
  }
})
