import { api } from "@/lib/api"
import type { TradeForm } from "@/types/board"
import type { Resp } from "@/types/common"
import type { EditorConfig, EditorImages, EditorPost, EditorTag } from "@/types/content"

export type EditorInput = {
  boardUid: number
  categoryUid: number
  content: string
  files: File[]
  isNotice: boolean
  isSecret: boolean
  title: string
  tags: string[]
  postUid?: number
}

const toForm = (input: EditorInput) => {
  const form = new FormData()
  form.append("boardUid", String(input.boardUid))
  form.append("categoryUid", String(input.categoryUid))
  form.append("content", input.content)
  form.append("isNotice", input.isNotice ? "1" : "0")
  form.append("isSecret", input.isSecret ? "1" : "0")
  form.append("title", input.title)
  form.append("tags", input.tags.join(","))
  if (input.postUid) form.append("postUid", String(input.postUid))
  input.files.forEach((file) => form.append("attachments[]", file))
  return form
}

export const editorApi = {
  config: (id: string) => api<Resp<EditorConfig>>("/editor/config", { query: { id } }),
  loadPost: (boardUid: number, postUid: number) =>
    api<Resp<EditorPost>>("/editor/load/post", { query: { boardUid, postUid } }),
  write: (input: EditorInput) =>
    api<Resp<number>>("/editor/write", { method: "POST", body: toForm(input) }),
  modify: (input: EditorInput & { postUid: number }) =>
    api<Resp<null>>("/editor/modify", { method: "PATCH", body: toForm(input) }),
  tags: (tag: string, limit = 10) =>
    api<Resp<EditorTag[]>>("/editor/suggestion/tag", { query: { tag, limit } }),
  titles: (title: string, limit = 5) =>
    api<Resp<string[]>>("/editor/suggestion/title", { query: { title, limit } }),
  images: (boardUid: number, lastUid: number, bunch = 12) =>
    api<Resp<EditorImages>>("/editor/load/images", { query: { boardUid, lastUid, bunch } }),
  thumbnail: (fileUid: number) =>
    api<Resp<string>>("/editor/load/thumbnail", { query: { fileUid } }),
  removeImage: (imageUid: number) =>
    api<Resp<null>>("/editor/remove/image", { method: "DELETE", query: { imageUid } }),
  removeAttachment: (boardUid: number, postUid: number, fileUid: number) =>
    api<Resp<null>>("/editor/remove/attached", {
      method: "DELETE",
      query: { boardUid, postUid, fileUid },
    }),
  uploadImages: (boardUid: number, files: File[]) => {
    const form = new FormData()
    form.append("boardUid", String(boardUid))
    files.forEach((file) => form.append("images[]", file))
    return api<Resp<string[]>>("/editor/upload/images", { method: "POST", body: form })
  },
}

export type TradeInput = EditorInput & TradeForm

const tradeForm = (input: TradeInput) => {
  const form = toForm(input)
  form.append("brand", input.brand)
  form.append("price", String(input.price))
  form.append("priceType", String(input.priceType))
  form.append("currency", input.currency)
  form.append("productCondition", String(input.productCondition))
  form.append("location", input.location)
  form.append("shippingType", String(input.shippingType))
  return form
}

export const tradeApi = {
  load: (boardUid: number, postUid: number) =>
    api<Resp<{ board: EditorPost; trade: import("@/types/board").TradeInfo }>>("/trade/load", {
      query: { boardUid, postUid },
    }),
  write: (input: TradeInput) =>
    api<Resp<{ postUid: number }>>("/trade/write", { method: "POST", body: tradeForm(input) }),
  modify: (input: TradeInput & { postUid: number }) =>
    api<Resp<null>>("/trade/modify", { method: "PATCH", body: tradeForm(input) }),
  status: (boardUid: number, postUid: number, status: number) => {
    const form = new FormData()
    form.append("boardUid", String(boardUid))
    form.append("postUid", String(postUid))
    form.append("status", String(status))
    return api<Resp<null>>("/trade/status", { method: "PATCH", body: form })
  },
}
