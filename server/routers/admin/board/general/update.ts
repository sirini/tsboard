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
import { fail, success, EXTEND_TYPE_CHECK } from "../../../../util/tools"
import { checkUserVerification } from "../../../../database/auth/authorization"
import { haveAdminPermission } from "../../../../database/user/manageuser"
import { NO_TABLE_TARGET } from "../../../../database/user/const"

export const update = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers: { authorization }, cookie: { refresh }, query: { userUid } }) => {
    let accessUserUid = 0
    let newAccessToken = ""

    const verification = await checkUserVerification({
      jwt,
      userUid: parseInt(userUid ?? "0"),
      accessToken: authorization ?? "",
      refreshToken: refresh.value ?? "",
    })

    if (
      verification.success === true &&
      (await haveAdminPermission(verification.accessUserUid, NO_TABLE_TARGET)) === true
    ) {
      accessUserUid = verification.accessUserUid
      newAccessToken = verification.newAccessToken
    }

    return {
      accessUserUid,
      newAccessToken,
    }
  })
  .patch(
    "/change/group",
    async ({ body: { groupUid, boardUid }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken,
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
      }
      if (groupUid < 1 || boardUid < 1) {
        return fail(`Invalid target.`, response)
      }
      await changeGroup(boardUid, groupUid)
      return success(response)
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        groupUid: t.Numeric(),
        boardUid: t.Numeric(),
      }),
    },
  )
  .patch(
    "/change/name",
    async ({ body: { boardUid, newName }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken,
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
      }
      if (boardUid < 1 || newName.length < 2) {
        return fail(`Invalid parameters.`, response)
      }
      await updateName(boardUid, Bun.escapeHTML(newName))
      return success(response)
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        newName: t.String(),
      }),
    },
  )
  .patch(
    "/change/info",
    async ({ body: { boardUid, newInfo }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken,
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
      }
      if (boardUid < 1 || newInfo.length < 2) {
        return fail(`Invalid parameters.`, response)
      }
      await updateInfo(boardUid, Bun.escapeHTML(newInfo))
      return success(response)
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        newInfo: t.String(),
      }),
    },
  )
  .patch(
    "/change/type",
    async ({ body: { boardUid, newType }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken,
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
      }
      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
      }
      await changeType(boardUid, newType)
      return success(response)
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        newType: t.Numeric(),
      }),
    },
  )
  .patch(
    "/change/rows",
    async ({ body: { boardUid, newRows }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken,
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
      }
      if (boardUid < 1 || newRows < 1) {
        return fail(`Invalid parameters.`, response)
      }
      await updateRows(boardUid, newRows)
      return success(response)
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        newRows: t.Numeric(),
      }),
    },
  )
  .patch(
    "/change/width",
    async ({ body: { boardUid, newWidth }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken,
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
      }
      if (boardUid < 1 || newWidth < 100) {
        return fail(`Invalid board uid.`, response)
      }
      await updateWidth(boardUid, newWidth)
      return success(response)
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        newWidth: t.Numeric(),
      }),
    },
  )
  .post(
    "/add/category",
    async ({ body: { boardUid, newCategory }, newAccessToken, accessUserUid }) => {
      let response = {
        newAccessToken,
        categoryUid: 0,
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
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
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        newCategory: t.String(),
      }),
    },
  )
  .delete(
    "/remove/category",
    async ({ body: { boardUid, categoryUid }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken,
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
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
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Number(),
        categoryUid: t.Number(),
      }),
    },
  )
  .patch(
    "/use/category",
    async ({ body: { boardUid, useCategory }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken,
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
      }
      if (boardUid < 1 || useCategory < 0 || useCategory > 1) {
        return fail(`Invalid parameters.`, response)
      }
      updateUseCategory(boardUid, useCategory)
      return success(response)
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        useCategory: t.Numeric(),
      }),
    },
  )
