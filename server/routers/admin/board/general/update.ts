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
import { fail, success, updateAccessToken } from "../../../../util/tools"

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
  .patch(
    "/changegroup",
    async ({ jwt, cookie: { refresh }, headers, body: { groupUid, boardUid } }) => {
      if (groupUid < 1 || boardUid < 1) {
        return fail(`Invalid target.`)
      }

      await changeGroup(boardUid, groupUid)

      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
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
    async ({ jwt, cookie: { refresh }, headers, body: { boardUid, newName } }) => {
      if (boardUid < 1) {
        return fail(`Invalid board uid.`)
      }
      if (newName.length < 2) {
        return fail(`Board name is too short.`)
      }

      await updateName(boardUid, newName)

      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
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
    async ({ jwt, cookie: { refresh }, headers, body: { boardUid, newInfo } }) => {
      if (boardUid < 1) {
        return fail(`Invalid board uid.`)
      }
      if (newInfo.length < 2) {
        return fail(`Board info is too short.`)
      }

      await updateInfo(boardUid, newInfo)

      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
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
    async ({ jwt, cookie: { refresh }, headers, body: { boardUid, newType } }) => {
      if (boardUid < 1) {
        return fail(`Invalid board uid.`)
      }

      await changeType(boardUid, newType)

      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
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
    async ({ jwt, cookie: { refresh }, headers, body: { boardUid, newRows } }) => {
      if (boardUid < 1) {
        return fail(`Invalid board uid.`)
      }

      await updateRows(boardUid, newRows)

      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
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
    async ({ jwt, cookie: { refresh }, headers, body: { boardUid, newWidth } }) => {
      if (boardUid < 1) {
        return fail(`Invalid board uid.`)
      }

      await updateWidth(boardUid, newWidth)

      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
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
    async ({ jwt, cookie: { refresh }, headers, body: { boardUid, newCategory } }) => {
      if (boardUid < 1) {
        return fail(`Invalid board uid.`)
      }
      if (newCategory.length < 2) {
        return fail(`Category name is too short.`)
      }

      const categoryUid = await addCategory(boardUid, newCategory)
      if (categoryUid < 1) {
        return fail(`Already added.`)
      }

      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
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
    async ({ jwt, cookie: { refresh }, headers, body: { boardUid, categoryUid } }) => {
      if (boardUid < 1) {
        return fail(`Invalid board uid.`)
      }
      if (categoryUid < 1) {
        return fail(`Invalid category uid.`)
      }

      const result = await removeCategory(boardUid, categoryUid)
      if (result === false) {
        return fail(`Unable to remove last category.`)
      }

      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
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
