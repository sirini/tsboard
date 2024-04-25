<template>
  <v-list density="compact">
    <v-list-subheader>{{ TEXT[home.lang].TITLE }}</v-list-subheader>
    <v-divider></v-divider>
    <v-list-item
      @click="util.go('myinfo')"
      :prepend-avatar="
        TSBOARD.PREFIX + (auth.user.profile.length < 1 ? '/no-profile.svg' : auth.user.profile)
      "
      append-icon="mdi-chevron-right"
    >
      <v-list-item-title>{{ auth.user.name }}</v-list-item-title>
      <v-list-item-subtitle class="email">{{ auth.user.id }}</v-list-item-subtitle>
      <v-tooltip activator="parent">{{ TEXT[home.lang].MODIFY_TOOLTIP }}</v-tooltip>
    </v-list-item>

    <v-list-item class="text-center mt-2">
      <v-chip color="blue-grey" prepend-icon="mdi-alpha-l" append-icon="mdi-alpha-p">
        {{ auth.user.level }}
        <v-divider vertical class="ml-2 mr-2"></v-divider>
        {{ auth.user.point }}
      </v-chip>
    </v-list-item>

    <v-list-item v-if="auth.user.admin" class="message text-center"
      ><strong>{{ TEXT[home.lang].WELCOME_ADMIN }}</strong>
    </v-list-item>
    <v-list-item v-else class="message text-center"
      >{{ TEXT[home.lang].WELCOME_USER }} <strong>{{ auth.user.name }}</strong></v-list-item
    >
    <v-divider></v-divider>
  </v-list>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../../../store/user/auth"
import { useUtilStore } from "../../../../store/util"
import { useHomeStore } from "../../../../store/home"
import { TSBOARD } from "../../../../../tsboard.config"
import { TEXT } from "../../../../messages/pages/home/components/drawer/side-drawer-myinfo"

const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()
</script>

<style scoped>
.email {
  font-size: 0.8em;
}
.message {
  font-size: 0.9em;
}
</style>
