<template>
  <v-card elevation="0">
    <v-list>
      <v-list-item class="mb-2">
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="permission.manager.name"
              variant="outlined"
              density="compact"
              hide-details
              @keyup="permission.updateBoardManagerSuggestion"
              @click:append-inner="permission.updateBoardManager()"
              append-inner-icon="mdi-cancel"
            >
              <v-menu activator="parent" open-on-hover>
                <v-list>
                  <v-list-item
                    v-for="(user, index) in permission.suggestions"
                    :key="index"
                    @click="permission.updateBoardManager(user)"
                  >
                    {{ user.name }}
                    <v-tooltip activator="parent" location="right">
                      이 회원을 {{ general.board.id }} 게시판 관리자로 지정합니다.
                    </v-tooltip>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-text-field>
          </v-col>
          <v-col class="mt-2">게시판 관리자를 지정합니다 (아이디 입력)</v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-access-level
          :level="permission.access.list"
          name="글 목록"
          @update="
            (level: number) => {
              permission.access.list = level
              permission.updateAccessPermission()
            }
          "
        ></board-change-access-level>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-access-level
          :level="permission.access.view"
          name="글 보기"
          @update="
            (level: number) => {
              permission.access.view = level
              permission.updateAccessPermission()
            }
          "
        ></board-change-access-level>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-access-level
          :level="permission.access.write"
          name="글 작성"
          @update="
            (level: number) => {
              permission.access.write = level
              permission.updateAccessPermission()
            }
          "
        ></board-change-access-level>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-access-level
          :level="permission.access.comment"
          name="댓글 작성"
          @update="
            (level: number) => {
              permission.access.comment = level
              permission.updateAccessPermission()
            }
          "
        ></board-change-access-level>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-1">
        <board-change-access-level
          :level="permission.access.download"
          name="다운로드"
          @update="
            (level: number) => {
              permission.access.download = level
              permission.updateAccessPermission()
            }
          "
        ></board-change-access-level>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useAdminBoardGeneralStore } from "../../../store/admin/board/general"
import { useAdminBoardPermissionStore } from "../../../store/admin/board/permission"
import BoardChangeAccessLevel from "../../../components/admin/board/BoardChangeAccessLevel.vue"

const general = useAdminBoardGeneralStore()
const permission = useAdminBoardPermissionStore()
</script>
