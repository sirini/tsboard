<template>
  <v-card elevation="0">
    <v-list>
      <v-list-subheader>회원 검색</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item class="mt-3 mb-3">
        <template v-slot:prepend>
          <v-btn-toggle v-model="adminUser.option" mandatory class="mt-1">
            <v-btn value="name">이름</v-btn>
            <v-btn value="id">아이디</v-btn>
            <v-btn value="level">레벨</v-btn>
          </v-btn-toggle>
        </template>

        <v-text-field
          variant="outlined"
          v-model="adminUser.keyword"
          hide-details
          class="ml-5 mt-1 mr-1"
          prepend-inner-icon="mdi-account-question-outline"
          append-inner-icon="mdi-magnify"
          @click:append-inner=""
        ></v-text-field>

        <template v-slot:append>
          <v-select
            v-model="adminUser.bunch"
            variant="outlined"
            class="mt-1"
            hide-details
            :items="[5, 10, 15, 20, 25, 30, 40, 50, 100]"
          ></v-select>
        </template>
      </v-list-item>

      <v-list-subheader>회원 목록</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item
        density="compact"
        v-for="(user, index) in adminUser.users"
        :key="index"
        class="underline"
      >
        <template v-slot:prepend>
          <span class="date mr-3">{{ util.date(user.signup) }}</span>
          <v-chip
            :prepend-avatar="
              user.profile.length < 1 ? `${TSBOARD.PREFIX}/no-profile.svg` : user.profile
            "
            append-icon="mdi-email-outline"
            color="blue-grey"
            size="small"
            >{{ user.name }} <v-divider vertical class="ml-3 mr-3"></v-divider>
            {{ user.id }}
          </v-chip>
        </template>

        <template v-slot:append>
          <v-chip
            prepend-icon="mdi-alpha-l"
            append-icon="mdi-alpha-p"
            color="blue-grey"
            size="small"
            class="ml-2 mr-2"
          >
            {{ user.level }} <v-divider vertical class="ml-3 mr-3"></v-divider> {{ user.point }}
          </v-chip>

          <v-btn elevation="0" icon @click="util.go('adminUserManager', '', user.uid)">
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent">
              클릭하시면 {{ user.name }}님의 정보를 수정하러 이동합니다.
            </v-tooltip>
          </v-btn>
          <v-btn
            elevation="0"
            icon
            @click="
              manage.openManageUser({
                uid: user.uid,
                name: user.name,
                profile: user.profile,
              })
            "
          >
            <v-icon>mdi-account-cog</v-icon>
            <v-tooltip activator="parent">
              클릭하시면 {{ user.name }}님의 권한 관리를 위한 창이 띄워집니다. 로그인을 차단하시면
              회원 자격이 박탈됩니다.
            </v-tooltip>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>

    <paging
      :page="adminUser.page"
      :page-length="adminUser.pageLength"
      @prev="adminUser.page -= 1"
      @next="adminUser.page += 1"
    ></paging>
  </v-card>
  <manage-user-dialog></manage-user-dialog>
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue"
import { useAdminUserStore } from "../../../store/admin/user/common"
import { useManageUserStore } from "../../../store/user/manageuser"
import { useUtilStore } from "../../../store/util"
import { TSBOARD } from "../../../../tsboard.config"
import ManageUserDialog from "../../user/ManageUserDialog.vue"
import Paging from "../common/AdminBottomPaging.vue"

const adminUser = useAdminUserStore()
const manage = useManageUserStore()
const util = useUtilStore()

onMounted(() => adminUser.loadUsers())
watch(
  () => [adminUser.page, adminUser.bunch, adminUser.isBlocked],
  () => adminUser.loadUsers(),
)
</script>

<style scoped>
.date {
  font-size: 0.9em;
  color: #546e7a;
}
.underline {
  border-bottom: #eceff1 1px solid;
}
.info {
  color: #cfd8dc;
}
</style>
