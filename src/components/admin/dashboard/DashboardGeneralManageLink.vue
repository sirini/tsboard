<template>
  <v-row>
    <v-col>
      <v-card class="ml-1 mt-3 mb-3">
        <v-card-title>
          그룹 목록
          <div class="more">
            <v-btn
              prepend-icon="mdi-cog-outline"
              rounded="xl"
              elevation="0"
              @click="util.go('adminBoardGroup')"
              >관리
              <v-tooltip activator="parent"> 클릭하시면 그룹 관리 페이지로 이동합니다. </v-tooltip>
            </v-btn>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-list density="compact">
          <v-list-item
            v-for="(group, index) in groups"
            :key="index"
            @click="util.go('adminBoardGroupManager', group)"
            append-icon="mdi-chevron-right"
          >
            <v-list-item-title>{{ group }}</v-list-item-title>
            <v-tooltip activator="parent">
              클릭하시면 {{ group }} 그룹 관리 페이지로 이동합니다.
            </v-tooltip>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col>
      <v-card class="mt-3 mb-3">
        <v-card-title> 게시판 목록 </v-card-title>
        <v-divider></v-divider>
        <v-list density="compact">
          <v-list-item
            v-for="(board, index) in boards"
            :key="index"
            append-icon="mdi-chevron-right"
            @click="util.go('adminBoardManager', board)"
          >
            <v-list-item-title>{{ board }}</v-list-item-title>
            <v-tooltip activator="parent">
              클릭하시면 {{ board }} 게시판 관리 페이지로 이동합니다.
            </v-tooltip>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col>
      <v-card class="mt-3 mb-3 mr-1">
        <v-card-title
          >회원 목록
          <div class="more">
            <v-btn
              prepend-icon="mdi-cog-outline"
              rounded="xl"
              elevation="0"
              @click="util.go('adminMember')"
              >관리
              <v-tooltip activator="parent"> 클릭하시면 회원 관리 페이지로 이동합니다. </v-tooltip>
            </v-btn>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-list density="compact">
          <v-list-item
            v-for="(member, index) in members"
            :key="index"
            append-icon="mdi-chevron-right"
            @click="router.push({ name: 'adminMemberManager', params: { uid: member.uid } })"
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
import { useRouter } from "vue-router"
import { useAdminDashboardStore } from "../../../store/admin/dashboard/general"
import { useUtilStore } from "../../../store/util"

const router = useRouter()
const dashboard = useAdminDashboardStore()
const util = useUtilStore()
const groups = ["default", "sample", "example"]
const boards = ["test", "notice", "freeboard", "qna", "gallery", "sample", "example"]
const members = [
  { uid: 111, name: "홍길동" },
  { uid: 222, name: "테스터" },
  { uid: 333, name: "나전설" },
  { uid: 444, name: "김탁구" },
  { uid: 555, name: "강감찬" },
]
</script>

<style scoped>
.more {
  position: absolute;
  top: 6px;
  right: 5px;
}
</style>
