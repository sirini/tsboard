<template>
  <v-row no-gutters>
    <v-col class="pa-1">
      <v-card class="mt-3 mb-3" :color="COLOR.ADMIN.MAIN" rounded="xl">
        <v-card-title>
          그룹 목록
          <div class="more">
            <v-btn
              prepend-icon="mdi-cog-outline"
              rounded="xl"
              elevation="0"
              @click="util.go('adminBoardGroup')"
              size="small"
              :color="COLOR.ADMIN.MAIN"
              >관리
              <v-tooltip activator="parent"> 클릭하시면 그룹 관리 페이지로 이동합니다. </v-tooltip>
            </v-btn>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-list density="compact">
          <v-list-item
            v-for="(group, index) in dashboard.groups"
            :key="index"
            @click="util.go('adminBoardGroupManager', group.name)"
          >
            <v-list-item-title>{{ group.name }}</v-list-item-title>
            <v-tooltip activator="parent">
              클릭하시면 {{ group.name }} 그룹 관리 페이지로 이동합니다.
            </v-tooltip>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col class="pa-1">
      <v-card class="mt-3 mb-3" :color="COLOR.ADMIN.MAIN" rounded="xl">
        <v-card-title class="title"> 게시판 목록 </v-card-title>
        <v-divider></v-divider>
        <v-list density="compact">
          <v-list-item
            v-for="(board, index) in dashboard.boards"
            :key="index"
            @click="util.go('adminBoardManager', board.name)"
          >
            <v-list-item-title>{{ board.name }}</v-list-item-title>
            <v-tooltip activator="parent">
              클릭하시면 {{ board.name }} 게시판 관리 페이지로 이동합니다.
            </v-tooltip>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col class="pa-1">
      <v-card class="mt-3 mb-3" :color="COLOR.ADMIN.MAIN" rounded="xl">
        <v-card-title class="title"
          >회원 목록
          <div class="more">
            <v-btn
              prepend-icon="mdi-cog-outline"
              rounded="xl"
              elevation="0"
              @click="util.go('adminUser')"
              size="small"
              :color="COLOR.ADMIN.MAIN"
              >관리
              <v-tooltip activator="parent"> 클릭하시면 회원 관리 페이지로 이동합니다. </v-tooltip>
            </v-btn>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-list density="compact">
          <v-list-item
            v-for="(member, index) in dashboard.members"
            :key="index"
            :prepend-avatar="
              TSBOARD.PREFIX + (member.profile.length < 1 ? '/no-profile.svg' : member.profile)
            "
            @click="util.go('adminUserManager', '', member.uid)"
            >{{ member.name }}
            <v-tooltip activator="parent"
              >클릭하시면 {{ member.name }}님 관리 페이지로 이동합니다.</v-tooltip
            >
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { COLOR, TSBOARD } from "../../../../tsboard.config"
import { useAdminDashboardStore } from "../../../store/admin/dashboard/general"
import { useUtilStore } from "../../../store/util"

const dashboard = useAdminDashboardStore()
const util = useUtilStore()
</script>

<style scoped>
.more {
  position: absolute;
  top: 8px;
  right: 10px;
}
</style>
