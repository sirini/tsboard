<template>
  <v-app class="app">
    <admin-header></admin-header>
    <v-container>
      <v-card class="mx-auto rounded-lg admin" max-width="1100">
        <v-layout>
          <v-navigation-drawer permanent location="left" width="200">
            <v-list>
              <v-list-item
                prepend-icon="mdi-cog-outline"
                append-icon="mdi-chevron-right"
                @click="menu = 'general'"
              >
                <strong v-if="menu === 'general'">일반</strong>
                <span v-else>일반</span>
              </v-list-item>
              <v-list-item
                prepend-icon="mdi-account-cancel"
                append-icon="mdi-chevron-right"
                @click="menu = 'block'"
              >
                <strong v-if="menu === 'block'">차단</strong>
                <span v-else>차단</span>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main">
            <member-list-general v-if="menu === 'general'"></member-list-general>
            <member-block-list v-if="menu === 'block'"></member-block-list>
          </v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAdminStore } from "../../store/admin/common"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import MemberListGeneral from "../../components/admin/member/MemberListGeneral.vue"
import MemberBlockList from "../../components/admin/member/MemberBlockList.vue"

const admin = useAdminStore()
const menu = ref<string>("general")

admin.clearBreadcrumbs()
admin.addBreadcrumbs("회원 목록", `${process.env.PREFIX}/admin/member`)
</script>

<style scoped>
.app {
  background-color: #eceff1;
}
.admin {
  margin-top: 100px;
}
.main {
  min-height: 300px;
}
</style>
