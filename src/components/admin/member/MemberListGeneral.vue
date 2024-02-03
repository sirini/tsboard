<template>
  <v-card elevation="0">
    <v-list>
      <v-list-subheader>회원 검색</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item>
        <v-row>
          <v-col cols="5">
            <v-btn-toggle v-model="general.option" mandatory class="mt-1">
              <v-btn size="large" value="name">이름</v-btn>
              <v-btn size="large" value="id">아이디</v-btn>
              <v-btn size="large" value="level">레벨</v-btn>
            </v-btn-toggle>
          </v-col>

          <v-col>
            <v-text-field
              variant="outlined"
              v-model="general.search"
              hide-details
              density="compact"
              class="mt-2"
              prepend-inner-icon="mdi-account-question-outline"
              append-inner-icon="mdi-magnify"
              @click:append-inner=""
            ></v-text-field>
          </v-col>
        </v-row>
      </v-list-item>

      <v-list-subheader>회원 목록</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item
        density="compact"
        v-for="(member, index) in general.members"
        :key="index"
        :prepend-avatar="member.profile"
      >
        <v-row>
          <v-col cols="3" class="text-center">{{ member.name }}</v-col>
          <v-col cols="3" class="text-center text-caption">{{ member.id }}</v-col>
          <v-col cols="3" class="text-center"
            ><span class="info">Lv.</span> {{ member.level }}
            <span class="info">/</span>
            {{ member.point }}
            <span class="info">P</span></v-col
          >
          <v-col cols="3" class="text-center text-caption">{{ member.signup }}</v-col>
        </v-row>
        <template v-slot:append>
          <v-btn
            elevation="0"
            icon
            @click="router.push({ name: 'adminMemberManager', params: { uid: member.uid } })"
          >
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent">
              클릭하시면 {{ member.name }}님의 정보를 수정하러 이동합니다.
            </v-tooltip>
          </v-btn>
          <v-btn
            elevation="0"
            icon
            @click="
              user.openManageUser({
                uid: member.uid,
                profile: PREFIX + member.profile,
                name: member.name,
              })
            "
          >
            <v-icon>mdi-account-cog</v-icon>
            <v-tooltip activator="parent">
              클릭하시면 {{ member.name }}님의 권한 관리를 위한 창이 띄워집니다. 로그인을 차단하시면
              회원 자격이 박탈됩니다.
            </v-tooltip>
          </v-btn>
        </template>
      </v-list-item>
      <v-divider></v-divider>
    </v-list>

    <v-pagination v-model="general.paging" :length="5" class="mb-3"></v-pagination>
  </v-card>
  <manage-user-dialog></manage-user-dialog>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useAdminMemberGeneralStore } from "../../../store/admin/member/general"
import { useUserStore } from "../../../store/user"
import ManageUserDialog from "../../user/ManageUserDialog.vue"

const router = useRouter()
const general = useAdminMemberGeneralStore()
const user = useUserStore()
const PREFIX = process.env.PREFIX || ""
</script>

<style scoped>
.info {
  color: #cfd8dc;
}
</style>
