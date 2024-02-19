/**
 * server/routers/admin/group/list/update
 *
 * 게시판 그룹 목록에 대한 업데이트 작업 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import {
  createGroup,
  getAdminInfo,
  removeGroup,
} from "../../../../database/admin/group/list/update"
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
  .post(
    "/creategroup",
    async ({ body: { newId }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
        uid: 0,
        id: "",
        manager: {
          uid: 0,
          name: "",
          profile: "",
        },
      }

      if (newId.length < 2) {
        return fail(`Group id is too short.`, response)
      }
      const newGroupUid = await createGroup(newId)
      if (newGroupUid < 1) {
        return fail(`Failed to create a new group, try another ID.`, response)
      }
      const admin = await getAdminInfo()
      if (admin.uid < 1) {
        return fail(`Unable to get a default admin information.`, response)
      }
      return success({
        newAccessToken,
        uid: newGroupUid,
        id: newId,
        manager: admin,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        newId: t.String(),
      }),
    },
  )
  .delete(
    "/removegroup",
    async ({ body: { groupUid }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
      }

      if (groupUid < 1) {
        return fail(`Invalid group uid.`, response)
      }
      const result = await removeGroup(groupUid)
      if (result === false) {
        return fail(`Failed to remove a group, it might be a last one.`, response)
      }
      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        groupUid: t.Number(),
      }),
    },
  )
