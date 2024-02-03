<template>
  <v-card elevation="0">
    <v-list>
      <v-list-subheader>신고 내용 검색</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item>
        <v-row>
          <v-col cols="5">
            <v-btn-toggle v-model="general.option" mandatory class="mt-1">
              <v-btn size="large" value="reporter">신고자명</v-btn>
              <v-btn size="large" value="request">내용</v-btn>
              <v-btn size="large" value="target">대상자명</v-btn>
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

      <v-list-subheader
        >신고 내용 목록 (신고 대상 / 신고 내용 / 신고자 / 신고 일시)</v-list-subheader
      >
      <v-divider></v-divider>
      <v-list-item v-for="(report, index) in general.reports" :key="index" class="underline">
        <v-row>
          <v-col cols="2" class="text-center"
            ><v-chip :prepend-avatar="PREFIX + report.to.profile" color="red" class="mt-1">{{
              report.to.name
            }}</v-chip></v-col
          >
          <v-col class="text-center mt-1 mb-1">{{ report.request }}</v-col>
          <v-col cols="2" class="text-center mt-1">
            <v-chip :prepend-avatar="PREFIX + report.from.profile" color="blue-grey" class="mt-1">{{
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
                profile: PREFIX + (report.to.profile || ''),
                name: report.to.name,
              })
            "
            ><v-icon>mdi-account-cog</v-icon>
            <v-tooltip activator="parent">
              클릭하시면 {{ report.to.name }}님의 권한 관리를 위한 창이 띄워집니다.</v-tooltip
            >
          </v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-pagination v-model="general.paging" :length="5" class="mb-3"></v-pagination>
  </v-card>
</template>

<script setup lang="ts">
import { useAdminReportGeneralStore } from "../../../store/admin/report/general"
import { useUserStore } from "../../../store/user"

const general = useAdminReportGeneralStore()
const user = useUserStore()
const PREFIX = process.env.PREFIX || ""
</script>

<style scoped>
.underline {
  border-bottom: #eceff1 1px solid;
}
</style>
