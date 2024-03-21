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
  updateUseCategory,
} from "../../../../database/admin/board/general/update"
import { fail, success, getUpdatedAccessToken, DEFAULT_TYPE_CHECK } from "../../../../util/tools"

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
        newAccessToken,
      }

      if (groupUid < 1 || boardUid < 1) {
        return fail(`Invalid target.`, response)
      }
      await changeGroup(boardUid, groupUid)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        groupUid: t.Numeric(),
        boardUid: t.Numeric(),
      }),
    },
  )
  .patch(
    "/updatename",
    async ({ body: { boardUid, newName }, newAccessToken }) => {
      const response = {
        newAccessToken,
      }

      if (boardUid < 1 || newName.length < 2) {
        return fail(`Invalid parameters.`, response)
      }
      await updateName(boardUid, Bun.escapeHTML(newName))
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        newName: t.String(),
      }),
    },
  )
  .patch(
    "/updateinfo",
    async ({ body: { boardUid, newInfo }, newAccessToken }) => {
      const response = {
        newAccessToken,
      }

      if (boardUid < 1 || newInfo.length < 2) {
        return fail(`Invalid parameters.`, response)
      }
      await updateInfo(boardUid, Bun.escapeHTML(newInfo))
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        newInfo: t.String(),
      }),
    },
  )
  .patch(
    "/changetype",
    async ({ body: { boardUid, newType }, newAccessToken }) => {
      const response = {
        newAccessToken,
      }

      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
      }
      await changeType(boardUid, newType)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        newType: t.Numeric(),
      }),
    },
  )
  .patch(
    "/updaterows",
    async ({ body: { boardUid, newRows }, newAccessToken }) => {
      const response = {
        newAccessToken,
      }

      if (boardUid < 1 || newRows < 1) {
        return fail(`Invalid parameters.`, response)
      }
      await updateRows(boardUid, newRows)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        newRows: t.Numeric(),
      }),
    },
  )
  .patch(
    "/updatewidth",
    async ({ body: { boardUid, newWidth }, newAccessToken }) => {
      const response = {
        newAccessToken,
      }

      if (boardUid < 1 || newWidth < 100) {
        return fail(`Invalid board uid.`, response)
      }
      await updateWidth(boardUid, newWidth)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        newWidth: t.Numeric(),
      }),
    },
  )
  .post(
    "/addcategory",
    async ({ body: { boardUid, newCategory }, newAccessToken }) => {
      let response = {
        newAccessToken,
        categoryUid: 0,
      }

      if (boardUid < 1 || newCategory.length < 2) {
        return fail(`Invalid parameters.`, response)
      }
      response.categoryUid = await addCategory(boardUid, Bun.escapeHTML(newCategory))
      if (response.categoryUid < 1) {
        return fail(`Already added.`, response)
      }
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        newCategory: t.String(),
      }),
    },
  )
  .delete(
    "/removecategory",
    async ({ body: { boardUid, categoryUid }, newAccessToken }) => {
      const response = {
        newAccessToken,
      }

      if (boardUid < 1 || categoryUid < 1) {
        return fail(`Invalid parameters.`, response)
      }
      const result = await removeCategory(boardUid, categoryUid)
      if (result === false) {
        return fail(`Unable to remove last category.`, response)
      }
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Number(),
        categoryUid: t.Number(),
      }),
    },
  )
  .patch(
    "/usecategory",
    async ({ body: { boardUid, useCategory }, newAccessToken }) => {
      const response = {
        newAccessToken,
      }

      if (boardUid < 1 || useCategory < 0 || useCategory > 1) {
        return fail(`Invalid parameters.`, response)
      }
      updateUseCategory(boardUid, useCategory)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        useCategory: t.Numeric(),
      }),
    },
  )
