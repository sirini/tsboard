import type { CommentItem } from "@/types/content"

export type CommentTreeItem = CommentItem & { children: CommentTreeItem[] }

export const buildCommentTree = (comments: CommentItem[]) => {
  const nodes = new Map<number, CommentTreeItem>()
  comments.forEach((item) => nodes.set(item.uid, { ...item, children: [] }))

  const roots: CommentTreeItem[] = []
  nodes.forEach((item) => {
    const parent = item.replyUid ? nodes.get(item.replyUid) : undefined
    if (parent) parent.children.push(item)
    else roots.push(item)
  })
  return roots
}
