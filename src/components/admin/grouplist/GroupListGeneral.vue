<template>
  <v-card elevation="0">
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
                    {{ group.id }} 는 이미 사용중입니다
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
        <v-row no-gutters>
          <v-col cols="4">
            <v-text-field
              v-model="group.id"
              variant="outlined"
              density="compact"
              hide-details
              readonly
              class="mt-2 mb-2 mr-3"
              prepend-inner-icon="mdi-identifier"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="group.manager.name"
              variant="outlined"
              hide-details
              density="compact"
              readonly
              class="mt-2 mb-2 mr-3"
              prepend-inner-icon="mdi-account-tie-hat"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="group.count"
              variant="outlined"
              hide-details
              density="compact"
              readonly
              class="mt-2 mb-2"
              prepend-inner-icon="mdi-counter"
            >
              <v-tooltip activator="parent"
                >{{ group.id }} 그룹에 총 {{ group.count }} 개의 게시판이 있습니다.</v-tooltip
              >
            </v-text-field>
          </v-col>
          <v-col class="text-right">
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
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useAdminGroupListStore } from "../../../store/admin/group/list"
import { useUtilStore } from "../../../store/util"

const list = useAdminGroupListStore()
const util = useUtilStore()
</script>
