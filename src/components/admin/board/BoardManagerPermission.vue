<template>
  <v-card elevation="0" rounded="0">
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
          <v-col class="mt-1">
            <v-chip
              :color="home.color.header"
              :prepend-avatar="
                TSBOARD.PREFIX + (permission.board.admin.profile || '/no-profile.svg')
              "
              variant="tonal"
              >{{ permission.board.admin.name }}
              <v-tooltip activator="parent">현재 게시판 관리자입니다.</v-tooltip>
            </v-chip></v-col
          >
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-manager-permission-item
          :type="ACTION_TYPE.LIST"
          :auth-user-only="false"
          @update="(level: number) => permission.updateListPermission(level)"
        ></board-manager-permission-item>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-manager-permission-item
          :type="ACTION_TYPE.VIEW"
          :auth-user-only="false"
          @update="(level: number) => permission.updateViewPermission(level)"
        ></board-manager-permission-item>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-manager-permission-item
          :type="ACTION_TYPE.WRITE"
          :auth-user-only="true"
          @update="(level: number) => permission.updateWritePermission(level)"
        ></board-manager-permission-item>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <board-manager-permission-item
          :type="ACTION_TYPE.COMMENT"
          :auth-user-only="true"
          @update="(level: number) => permission.updateCommentPermission(level)"
        ></board-manager-permission-item>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-1">
        <board-manager-permission-item
          :type="ACTION_TYPE.DOWNLOAD"
          :auth-user-only="true"
          @update="(level: number) => permission.updateDownloadPermission(level)"
        ></board-manager-permission-item>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { TSBOARD } from "../../../../tsboard.config"
import { ACTION_TYPE } from "../../../interface/admin"
import { useAdminBoardPermissionStore } from "../../../store/admin/board/permission"
import { useAdminStore } from "../../../store/admin/common"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import BoardManagerPermissionItem from "./BoardManagerPermissionItem.vue"

const admin = useAdminStore()
const auth = useAuthStore()
const home = useHomeStore()
const permission = useAdminBoardPermissionStore()
onMounted(() => {
  if (auth.user.uid !== 1) {
    admin.error(`그룹 관리자 이상만 사용 가능합니다.`, 10_000)
    return
  }
  permission.loadPermissionConfig()
})
</script>
