<template>
  <v-card elevation="0">
    <v-list>
      <v-list-subheader>신고 내용 검색</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item>
        <v-row>
          <v-col cols="5">
            <v-btn-toggle v-model="general.option" mandatory class="mt-1">
              <v-btn size="large" value="reporterName">신고자명</v-btn>
              <v-btn size="large" value="reporterContent">내용</v-btn>
              <v-btn size="large" value="targetName">대상자명</v-btn>
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
      <v-list-subheader>신고 내용 목록</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item v-for="(report, index) in general.reports" :key="index" class="underline">
        <v-row>
          <v-col cols="2" class="text-center"
            ><v-chip :prepend-avatar="report.to.profile" color="blue-grey" class="mt-1">{{
              report.to.name
            }}</v-chip></v-col
          >
          <v-col class="text-center mt-1 mb-1">{{ report.content }}</v-col>
          <v-col cols="2" class="text-center mt-1">
            <v-chip :prepend-avatar="report.from.profile" color="blue-grey" class="mt-1">{{
              report.from.name
            }}</v-chip>
          </v-col>
          <v-col cols="2" class="text-center mt-1">{{ report.date }}</v-col>
        </v-row>
        <template v-slot:append>
          <v-btn
            elevation="0"
            icon
            @click="
              user.openManageUser({
                uid: report.to.uid,
                profile: report.to.profile || '',
                name: report.to.name,
              })
            "
            ><v-icon>mdi-account-cog</v-icon>
            <v-tooltip activator="parent"> 클릭하시면 회원 관리를 위한 창이 띄워집니다. </v-tooltip>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
    <v-pagination v-model="general.paging" :length="5" class="mb-3"></v-pagination>
  </v-card>
  <manage-user-dialog></manage-user-dialog>
</template>

<script setup lang="ts">
import { useAdminReportGeneralStore } from "../../../store/admin/report/general"
import { useUserStore } from "../../../store/user"
import ManageUserDialog from "../../../components/user/ManageUserDialog.vue"

const general = useAdminReportGeneralStore()
const user = useUserStore()
</script>

<style scoped>
.underline {
  border-bottom: #eceff1 1px solid;
}
</style>
