<template>
  <v-chip
    variant="text"
    prepend-icon="mdi-package-variant"
    size="small"
    :color="COLOR.HOME.MAIN"
    :append-icon="view.post.writer.uid === auth.user.uid ? 'mdi-chevron-down' : ''"
    >{{ trade.item.statusStr }}

    <v-menu activator="parent" v-if="view.post.writer.uid === auth.user.uid" open-on-hover>
      <v-list rounded="xl">
        <v-list-item>
          <template v-slot:prepend>
            <v-icon size="small">mdi-package-variant</v-icon>
          </template>

          {{ DEAL_STATUS[home.lang][TRADE_STATUS.OPEN] }}

          <template v-slot:append v-if="trade.item.status === TRADE_STATUS.OPEN">
            <v-icon size="small">mdi-check-circle</v-icon>
          </template>
        </v-list-item>

        <v-list-item>
          <template v-slot:prepend>
            <v-icon size="small">mdi-package-variant-closed</v-icon>
          </template>

          {{ DEAL_STATUS[home.lang][TRADE_STATUS.IN_PROGRESS] }}

          <template v-slot:append v-if="trade.item.status === TRADE_STATUS.IN_PROGRESS">
            <v-icon size="small">mdi-check-circle</v-icon>
          </template>
        </v-list-item>

        <v-list-item>
          <template v-slot:prepend>
            <v-icon size="small">mdi-package-variant-closed-check</v-icon>
          </template>

          {{ DEAL_STATUS[home.lang][TRADE_STATUS.DONE] }}

          <template v-slot:append v-if="trade.item.status === TRADE_STATUS.DONE">
            <v-icon size="small">mdi-check-circle</v-icon>
          </template>
        </v-list-item>

        <v-list-item>
          <template v-slot:prepend>
            <v-icon size="small">mdi-package-variant-remove</v-icon>
          </template>

          {{ DEAL_STATUS[home.lang][TRADE_STATUS.NOT_AVAILABLE] }}

          <template v-slot:append v-if="trade.item.status === TRADE_STATUS.NOT_AVAILABLE">
            <v-icon size="small">mdi-check-circle</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-tooltip activator="parent" v-if="view.post.writer.uid === auth.user.uid">
      {{ TEXT[home.lang].CHANGE_STATUS }}
    </v-tooltip>
  </v-chip>
</template>

<script setup lang="ts">
import { COLOR } from "../../../../tsboard.config"
import { TRADE_STATUS } from "../../../interface/trade_interface"
import { DEAL_STATUS, TEXT } from "../../../messages/pages/board/trade"
import { useTradeStore } from "../../../store/board/trade"
import { useBoardViewStore } from "../../../store/board/view"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"

const trade = useTradeStore()
const view = useBoardViewStore()
const auth = useAuthStore()
const home = useHomeStore()
</script>
