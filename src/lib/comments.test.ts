import { describe, expect, it } from "vitest"
import { buildCommentTree } from "./comments"
import type { CommentItem } from "@/types/content"

const comment = (uid: number, replyUid = uid): CommentItem => ({
  uid,
  replyUid,
  postUid: 10,
  writer: { uid, name: `user-${uid}`, profile: "" },
  content: `comment-${uid}`,
  like: 0,
  liked: false,
  submitted: uid,
  modified: 0,
  status: 0,
})

describe("buildCommentTree", () => {
  it("treats GOAPI self-referencing comments as roots and nests their replies", () => {
    const source = [comment(1), comment(2, 1), comment(3, 2), comment(4)]
    const tree = buildCommentTree(source)

    expect(tree.map((item) => item.uid)).toEqual([1, 4])
    expect(tree[0]?.children[0]?.uid).toBe(2)
    expect(tree[0]?.children[0]?.children[0]?.uid).toBe(3)
    expect(source.every((item) => !("children" in item))).toBe(true)
  })

  it("keeps orphaned replies visible at root level", () => {
    expect(buildCommentTree([comment(2, 999)])[0]?.uid).toBe(2)
  })
})
