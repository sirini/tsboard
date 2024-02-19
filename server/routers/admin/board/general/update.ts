/**
 * server/routers/admin/board/general/update
 *
 * 게시판 관리화면 > 일반 > 업데이트 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import {
  changeGroup,
  updateName,
  updateInfo,
  changeType,
  updateRows,
  updateWidth,
  addCategory,
  removeCategory,
} from "../../../../database/admin/board/general/update"
import { fail, success, getUpdatedAccessToken } from "../../../../util/tools"

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

export const update = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers, cookie }) => {
    let accessUserUid = 0
    let newAccessToken = ""

    if (headers.authorization !== undefined && cookie && cookie.refresh) {
      const access = await jwt.verify(headers.authorization)
      if (access !== false) {
        accessUserUid = access.uid as number
        newAccessToken = await getUpdatedAccessToken(
          jwt,
          headers.authorization,
          cookie.refresh.value,
        )
      }
    }
    return {
      accessUserUid,
      newAccessToken,
    }
  })
  .patch(
    "/changegroup",
    async ({ body: { groupUid, boardUid }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
      }

      if (groupUid < 1 || boardUid < 1) {
        return fail(`Invalid target.`, response)
      }
      await changeGroup(boardUid, groupUid)
      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        groupUid: t.Number(),
        boardUid: t.Number(),
      }),
    },
  )
  .patch(
    "/updatename",
    async ({ body: { boardUid, newName }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
      }

      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
      }
      if (newName.length < 2) {
        return fail(`Board name is too short.`, response)
      }
      await updateName(boardUid, Bun.escapeHTML(newName))
      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        boardUid: t.Number(),
        newName: t.String(),
      }),
    },
  )
  .patch(
    "/updateinfo",
    async ({ body: { boardUid, newInfo }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
      }

      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
      }
      if (newInfo.length < 2) {
        return fail(`Board info is too short.`, response)
      }
      await updateInfo(boardUid, Bun.escapeHTML(newInfo))
      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        boardUid: t.Number(),
        newInfo: t.String(),
      }),
    },
  )
  .patch(
    "/changetype",
    async ({ body: { boardUid, newType }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
      }

      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
      }
      await changeType(boardUid, newType)
      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        boardUid: t.Number(),
        newType: t.Number(),
      }),
    },
  )
  .patch(
    "/updaterows",
    async ({ body: { boardUid, newRows }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
      }

      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
      }
      await updateRows(boardUid, newRows)
      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        boardUid: t.Number(),
        newRows: t.Number(),
      }),
    },
  )
  .patch(
    "/updatewidth",
    async ({ body: { boardUid, newWidth }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
      }

      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
      }
      await updateWidth(boardUid, newWidth)
      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        boardUid: t.Number(),
        newWidth: t.Number(),
      }),
    },
  )
  .post(
    "/addcategory",
    async ({ body: { boardUid, newCategory }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
        categoryUid: 0,
      }

      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
      }
      if (newCategory.length < 2) {
        return fail(`Category name is too short.`, response)
      }
      const categoryUid = await addCategory(boardUid, Bun.escapeHTML(newCategory))
      if (categoryUid < 1) {
        return fail(`Already added.`, response)
      }
      return success({
        newAccessToken,
        categoryUid,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        boardUid: t.Number(),
        newCategory: t.String(),
      }),
    },
  )
  .delete(
    "/removecategory",
    async ({ body: { boardUid, categoryUid }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
      }

      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
      }
      if (categoryUid < 1) {
        return fail(`Invalid category uid.`, response)
      }
      const result = await removeCategory(boardUid, categoryUid)
      if (result === false) {
        return fail(`Unable to remove last category.`, response)
      }
      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        boardUid: t.Number(),
        categoryUid: t.Number(),
      }),
    },
  )
