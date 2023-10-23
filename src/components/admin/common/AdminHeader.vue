<template>
  <v-app-bar flat rounded="0">
    <v-toolbar color="white" class="toolbar">
      <v-app-bar-title>
        <span class="logo" @click="router.push({ name: 'admin' })">TSBOARD/ADMIN</span>

        <v-btn size="large" class="firstTopButton btn"
          >BOARD
          <v-menu activator="parent" open-on-hover>
            <v-list>
              <v-list-item
                v-for="(group, index) in admin.group"
                :key="index"
                @click=""
                append-icon="mdi-chevron-right"
              >
                {{ group.name }}
                <v-menu activator="parent" location="right" open-on-hover>
                  <v-list>
                    <v-list-item v-for="(board, index) in group.boards" :key="index" @click="">
                      {{ board.name }}
                      <v-tooltip activator="parent">{{ board.info }}</v-tooltip>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>

        <v-btn size="large" class="btn"
          >MEMBER
          <v-menu activator="parent" open-on-hover>
            <v-list>
              <v-list-item @click="">그룹 관리자</v-list-item>
              <v-list-item @click="">게시판(갤러리) 관리자</v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </v-app-bar-title>
    </v-toolbar>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useAdminStore } from "../../../store/admin"

const router = useRouter()
const admin = useAdminStore()
</script>

<style scoped>
.toolbar {
  border-bottom: #d2d2d2 1px solid;
  .logo {
    position: absolute;
    top: 18px;
    left: 60px;
    font-family: "Oswald", sans-serif;
    font-size: 1.3em;
    cursor: pointer;
    font-weight: bold;
  }
  .firstTopButton {
    margin-left: 230px;
  }
  .btn {
    font-family: "Oswald", sans-serif;
    font-size: 1em;
  }
}
</style>
