/**
 * server/routers/admin/group/list/update
 *
 * 게시판 그룹 목록에 대한 업데이트 작업 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { createGroup, removeGroup } from "../../../../database/admin/group/list/update"
import { fail, success, EXTEND_TYPE_CHECK } from "../../../../util/tools"
import { getUserBasic } from "../../../../database/board/list"
import { SUPER_ADMIN_UID } from "../../../../database/auth/const"
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
      refreshToken: refresh.value,
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
  .post(
    "/create/group",
    async ({ body: { newId }, newAccessToken, accessUserUid }) => {
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

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
      }
      if (newId.length < 2) {
        return fail(`Group id is too short.`, response)
      }
      const newGroupUid = await createGroup(newId)
      if (newGroupUid < 1) {
        return fail(`Failed to create a new group, try another ID.`, response)
      }
      const admin = await getUserBasic(SUPER_ADMIN_UID)
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
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        newId: t.String(),
      }),
    },
  )
  .delete(
    "/remove/group",
    async ({ body: { groupUid }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken: "",
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
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
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        groupUid: t.Number(),
      }),
    },
  )
