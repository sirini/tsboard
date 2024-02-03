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
  .post(
    "/creategroup",
    async ({ jwt, cookie: { refresh }, headers, body }) => {
      if (body.newId.length < 2) {
        return fail(`Group id is too short.`)
      }
      const newGroupUid = await createGroup(body.newId)
      if (newGroupUid < 1) {
        return fail(`Failed to create a new group, try another ID.`)
      }
      const admin = await getAdminInfo()
      if (admin.uid < 1) {
        return fail(`Unable to get a default admin information.`)
      }

      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        newAccessToken,
        uid: newGroupUid,
        id: body.newId,
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
    async ({ jwt, cookie: { refresh }, headers, body }) => {
      if (body.groupUid < 1) {
        return fail(`Invalid group uid.`)
      }
      const result = await removeGroup(body.groupUid)
      if (result === false) {
        return fail(`Failed to remove a group, it might be a last one.`)
      }
      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
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
