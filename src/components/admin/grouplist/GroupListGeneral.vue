<template>
  <v-card elevation="0" rounded="0">
    <v-list>
      <v-list-item class="mb-2">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="list.newGroupId"
              variant="outlined"
              density="compact"
              hide-details
              append-inner-icon="mdi-plus-circle-outline"
              @keyup="list.updateExistGroupIds"
              @click:append-inner="list.createNewGroup"
              @keyup.enter="list.createNewGroup"
            >
              <v-menu activator="parent">
                <v-list>
                  <v-list-item v-for="(group, index) in list.existGroupIds" :key="index">
                    {{ util.unescape(group.name) }}
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-tooltip activator="parent">
                그룹명에는 알파벳 소문자와 숫자 그리고 _ (밑줄) 만 허용됩니다.
              </v-tooltip>
            </v-text-field>
          </v-col>
          <v-col class="mt-2">{{ list.newGroupId }} 그룹을 새롭게 생성합니다.</v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-subheader
        >총 {{ list.groups.length }} 개의 게시판 그룹들 (게시판 아이디 / 관리자 아이디 / 소속 게시판
        개수)</v-list-subheader
      >
      <v-list-item v-for="(group, index) in list.groups" :key="index">
        <template v-slot:prepend>
          <v-chip
            variant="outlined"
            :color="COLOR.HOME.HEADER"
            prepend-icon="mdi-identifier"
            @click="list.openChangeGroupIdDialog(group.uid, group.id)"
            >{{ group.id }}
            <v-tooltip activator="parent"
              >클릭하시면 그룹ID를 변경하실 수 있는 창이 나타납니다</v-tooltip
            >
          </v-chip>
        </template>

        <v-chip
          variant="tonal"
          :color="COLOR.HOME.HEADER"
          class="ml-2"
          :prepend-avatar="TSBOARD.PREFIX + (group.manager.profile || '/no-profile.svg')"
        >
          <strong class="ml-1">{{ util.unescape(group.manager.name) }}</strong>
          <v-divider vertical class="ml-2 mr-2"></v-divider>
          <strong class="mr-1">{{ group.count }}</strong> board(s)
        </v-chip>

        <template v-slot:append>
          <v-btn
            icon
            @click="util.go('adminBoardGroupManager', group.id)"
            elevation="0"
            class="mt-1"
            ><v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent">클릭하시면 그룹 설정을 수정하러 이동합니다</v-tooltip>
          </v-btn>
          <v-btn
            icon
            @click="list.confirmRemoveGroup(group.uid, group.id)"
            elevation="0"
            class="mt-1"
            ><v-icon>mdi-trash-can</v-icon>
            <v-tooltip activator="parent">클릭하시면 이 그룹을 삭제합니다</v-tooltip>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-card>

  <change-group-id-dialog></change-group-id-dialog>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { TSBOARD } from "../../../../tsboard.config"
import { useAdminGroupListStore } from "../../../store/admin/group/list"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"
import ChangeGroupIdDialog from "./ChangeGroupIdDialog.vue"

const list = useAdminGroupListStore()
const util = useUtilStore()
const home = useHomeStore()

onMounted(() => list.loadGroupList())
</script>
