<template>
  <v-list>
    <v-list-item density="compact" class="pa-0 mt-6 mb-3">
      <template v-slot:prepend>
        <v-chip
          class="mr-2"
          :disabled="auth.user.uid < 1"
          :prepend-icon="view.post.liked ? 'mdi-heart' : 'mdi-heart-outline'"
          :color="view.post.liked ? 'red' : 'blue-grey'"
          @click="view.like(!view.post.liked)"
        >
          {{ util.num(view.post.like) }}
          <v-tooltip activator="parent">{{ TEXT[home.lang].LIKE_TOOLTIP }}</v-tooltip>
        </v-chip>

        <user-nametag
          :profile="view.post.writer.profile"
          :uid="view.post.writer.uid"
          :name="view.post.writer.name"
          :size="'default'"
        ></user-nametag>
      </template>

      <template v-slot:append>
        <v-btn
          prepend-icon="mdi-pencil"
          variant="text"
          @click="util.go('boardModify', view.id, view.postUid)"
          :disabled="auth.user.uid !== view.post.writer.uid && !auth.user.admin"
          >{{ TEXT[home.lang].MODIFY }}</v-btn
        >
        <v-btn
          prepend-icon="mdi-trash-can"
          variant="text"
          @click="view.openConfirmRemoveDialog"
          :disabled="auth.user.uid !== view.post.writer.uid && !auth.user.admin"
          >{{ TEXT[home.lang].REMOVE }}
        </v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { useBoardViewStore } from "../../../store/board/view"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"
import { useHomeStore } from "../../../store/home"
import UserNametag from "../../../components/user/UserNametag.vue"
import { TEXT } from "../../../messages/pages/board/view"

const view = useBoardViewStore()
const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()
</script>
