<template>
  <v-card elevation="0">
    <v-list>
      <v-list-item class="mb-2">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="permission.boardNewAdmin"
              variant="outlined"
              density="compact"
              hide-details
              @keyup="permission.updateBoardManagerSuggestion"
              append-inner-icon="mdi-chevron-down"
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
                      이 회원을 {{ permission.board.id }} 게시판 관리자로 지정합니다.
                    </v-tooltip>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-tooltip activator="parent"
                >회원명(닉네임)으로 검색하시면 되며, 검색하는 동안 마우스를 계속
                올려두세요!</v-tooltip
              >
            </v-text-field>
          </v-col>
          <v-col class="mt-2">
            <v-chip
              size="small"
              label
              :prepend-avatar="permission.board.admin.profile"
              variant="tonal"
              >{{ permission.board.admin.name }}
              <v-tooltip activator="parent">현재 게시판 관리자입니다.</v-tooltip>
            </v-chip></v-col
          >
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-access-level
          :level="permission.board.level.list"
          name="글 목록"
          @update="(level: number) => permission.updateListPermission(level)"
        ></board-change-access-level>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-access-level
          :level="permission.board.level.view"
          name="글 보기"
          @update="(level: number) => permission.updateViewPermission(level)"
        ></board-change-access-level>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-access-level
          :level="permission.board.level.write"
          name="글 작성"
          @update="(level: number) => permission.updateWritePermission(level)"
        ></board-change-access-level>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-change-access-level
          :level="permission.board.level.comment"
          name="댓글 작성"
          @update="(level: number) => permission.updateCommentPermission(level)"
        ></board-change-access-level>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-1">
        <board-change-access-level
          :level="permission.board.level.download"
          name="다운로드"
          @update="(level: number) => permission.updateDownloadPermission(level)"
        ></board-change-access-level>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useAdminBoardPermissionStore } from "../../../store/admin/board/permission"
import BoardChangeAccessLevel from "../../../components/admin/board/BoardChangeAccessLevel.vue"

const permission = useAdminBoardPermissionStore()
onMounted(() => permission.loadPermissionConfig())
</script>
