<template>
  <v-card elevation="0">
    <v-list>
      <v-list-item class="mb-2">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="general.group.manager.name"
              variant="outlined"
              density="compact"
              hide-details
              @keyup="general.updateGroupManagerSuggestion"
              append-inner-icon="mdi-chevron-down"
            >
              <v-menu activator="parent" open-on-hover>
                <v-list>
                  <v-list-item
                    v-for="(user, index) in general.suggestions"
                    :key="index"
                    @click="general.updateGroupManager(user)"
                  >
                    {{ user.name }}
                    <v-tooltip activator="parent" location="right">
                      이 회원을 {{ general.group.id }} 그룹의 관리자로 지정합니다.
                    </v-tooltip>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-text-field>
          </v-col>
          <v-col class="mt-2">그룹 관리자를 지정합니다 (아이디 입력)</v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item class="mt-2 mb-2">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="general.newBoardId"
              variant="outlined"
              density="compact"
              hide-details
              append-inner-icon="mdi-plus-circle-outline"
              @keyup="general.updateExistBoardIds"
              @click:append-inner="general.createNewBoard"
            >
              <v-menu activator="parent">
                <v-list>
                  <v-list-item v-for="(board, index) in general.existBoardIds" :key="index">
                    {{ board.id }} 는 이미 사용중입니다
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-text-field>
          </v-col>
          <v-col class="mt-2">
            {{ general.group.id }} 그룹에 {{ general.newBoardId }} 게시판을 생성합니다.
          </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-subheader
        >{{ general.group.id }} 그룹 소속 게시판 목록 (총
        {{ general.boards.length }} 개)</v-list-subheader
      >
      <v-list-item v-for="(board, index) in general.boards" :key="index">
        <v-row no-gutters>
          <v-col cols="2">
            <v-text-field
              v-model="board.id"
              variant="outlined"
              density="compact"
              hide-details
              readonly
              class="mt-2 mr-3"
              prepend-inner-icon="mdi-identifier"
            ></v-text-field
          ></v-col>
          <v-col cols="5">
            <v-text-field
              v-model="board.info"
              variant="outlined"
              density="compact"
              hide-details
              readonly
              class="mt-2 mr-3"
              prepend-inner-icon="mdi-information"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="board.admin"
              variant="outlined"
              density="compact"
              width="100"
              hide-details
              readonly
              class="mt-2 mr-3"
              prepend-inner-icon="mdi-account-tie-hat"
            ></v-text-field>
          </v-col>
          <v-col class="text-right">
            <v-btn icon @click="util.go('boardList', board.id)" elevation="0" class="mt-1"
              ><v-icon>mdi-link-variant</v-icon>
              <v-tooltip activator="parent"> 클릭하시면 게시판을 보러 이동합니다 </v-tooltip>
            </v-btn>
            <v-btn icon @click="util.go('adminBoardManager', board.id)" elevation="0" class="mt-1"
              ><v-icon>mdi-pencil</v-icon>
              <v-tooltip activator="parent">
                클릭하시면 게시판 설정을 수정하러 이동합니다
              </v-tooltip>
            </v-btn>
            <v-btn
              icon
              @click="general.confirmRemoveBoard(board.uid, board.id)"
              elevation="0"
              class="mt-1"
              ><v-icon>mdi-trash-can</v-icon>
              <v-tooltip activator="parent"> 클릭하시면 이 게시판을 삭제합니다 </v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-card>
  <confirm-remove-board-dialog></confirm-remove-board-dialog>
</template>

<script setup lang="ts">
import { useAdminGroupGeneralStore } from "../../../store/admin/group/general"
import { useUtilStore } from "../../../store/util"
import ConfirmRemoveBoardDialog from "./ConfirmRemoveBoardDialog.vue"

const general = useAdminGroupGeneralStore()
const util = useUtilStore()
</script>
