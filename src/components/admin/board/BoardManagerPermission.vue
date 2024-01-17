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
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="permission.board.level.list"
              variant="outlined"
              type="number"
              density="compact"
              hide-details
              readonly
              prepend-inner-icon="mdi-format-list-numbered"
              append-inner-icon="mdi-chevron-down"
            >
              <v-menu activator="parent" open-on-hover>
                <v-list>
                  <v-list-item
                    v-for="(_, lv) in 10"
                    :key="lv"
                    @click="permission.updateListPermission(lv)"
                    :append-icon="permission.board.level.list === lv ? 'mdi-check' : ''"
                  >
                    {{ lv }} 레벨
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-text-field>
          </v-col>
          <v-col class="mt-2"> 글 목록 레벨 제한을 설정합니다. (0 = 비회원, 9 = 최고레벨) </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="permission.board.level.view"
              variant="outlined"
              type="number"
              density="compact"
              hide-details
              readonly
              prepend-inner-icon="mdi-format-list-numbered"
              append-inner-icon="mdi-chevron-down"
            >
              <v-menu activator="parent" open-on-hover>
                <v-list>
                  <v-list-item
                    v-for="(_, lv) in 10"
                    :key="lv"
                    @click="permission.updateViewPermission(lv)"
                    :append-icon="permission.board.level.view === lv ? 'mdi-check' : ''"
                  >
                    {{ lv }} 레벨
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-text-field>
          </v-col>
          <v-col class="mt-2"> 글 보기 레벨 제한을 설정합니다. (0 = 비회원, 9 = 최고레벨) </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="permission.board.level.write"
              variant="outlined"
              type="number"
              density="compact"
              hide-details
              readonly
              prepend-inner-icon="mdi-format-list-numbered"
              append-inner-icon="mdi-chevron-down"
            >
              <v-menu activator="parent" open-on-hover>
                <v-list>
                  <v-list-item
                    v-for="(_, lv) in 10"
                    :key="lv"
                    @click="permission.updateWritePermission(lv)"
                    :append-icon="permission.board.level.write === lv ? 'mdi-check' : ''"
                  >
                    {{ lv }} 레벨
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-text-field>
          </v-col>
          <v-col class="mt-2"> 글 쓰기 레벨 제한을 설정합니다. (0 = 비회원, 9 = 최고레벨) </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="permission.board.level.comment"
              variant="outlined"
              type="number"
              density="compact"
              hide-details
              readonly
              prepend-inner-icon="mdi-format-list-numbered"
              append-inner-icon="mdi-chevron-down"
            >
              <v-menu activator="parent" open-on-hover>
                <v-list>
                  <v-list-item
                    v-for="(_, lv) in 10"
                    :key="lv"
                    @click="permission.updateCommentPermission(lv)"
                    :append-icon="permission.board.level.comment === lv ? 'mdi-check' : ''"
                  >
                    {{ lv }} 레벨
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-text-field>
          </v-col>
          <v-col class="mt-2"> 댓글 작성 레벨 제한을 설정합니다. (0 = 비회원, 9 = 최고레벨) </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-1">
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="permission.board.level.download"
              variant="outlined"
              type="number"
              density="compact"
              hide-details
              readonly
              prepend-inner-icon="mdi-format-list-numbered"
              append-inner-icon="mdi-chevron-down"
            >
              <v-menu activator="parent" open-on-hover>
                <v-list>
                  <v-list-item
                    v-for="(_, lv) in 10"
                    :key="lv"
                    @click="permission.updateDownloadPermission(lv)"
                    :append-icon="permission.board.level.download === lv ? 'mdi-check' : ''"
                  >
                    {{ lv }} 레벨
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-text-field>
          </v-col>
          <v-col class="mt-2"> 다운로드 레벨 제한을 설정합니다. (0 = 비회원, 9 = 최고레벨) </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useAdminBoardPermissionStore } from "../../../store/admin/board/permission"

const permission = useAdminBoardPermissionStore()
onMounted(() => permission.loadPermissionConfig())
</script>
