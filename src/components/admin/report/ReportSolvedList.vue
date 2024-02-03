<template>
  <v-card elevation="0">
    <v-list>
      <v-list-subheader>조치된 신고 내용 검색</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item>
        <v-row>
          <v-col cols="5">
            <v-btn-toggle v-model="solved.option" mandatory class="mt-1">
              <v-btn size="large" value="reporter">신고자명</v-btn>
              <v-btn size="large" value="request">내용</v-btn>
              <v-btn size="large" value="target">대상자명</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              v-model="solved.search"
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

      <v-list-subheader>조치 내역 (신고 대상 / 신고 내용 / 조치 내용)</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item v-for="(report, index) in solved.reports" :key="index" class="underline">
        <v-row>
          <v-col cols="2" class="text-center"
            ><v-chip :prepend-avatar="PREFIX + report.to.profile" color="blue-grey" class="mt-1">{{
              report.to.name
            }}</v-chip></v-col
          >
          <v-col class="text-center mt-1 mb-1">
            {{ report.request }}

            <v-card
              elevation="0"
              class="mt-2 mb-1 pa-1"
              rounded="xl"
              variant="tonal"
              color="success"
            >
              {{ report.response }}
            </v-card>
          </v-col>
        </v-row>
        <template v-slot:append>
          <v-btn
            elevation="0"
            class="ml-2"
            icon
            @click="
              user.openManageUser({
                uid: report.to.uid,
                profile: PREFIX + (report.to.profile || ''),
                name: report.to.name,
              })
            "
            ><v-icon>mdi-account-cog</v-icon>
            <v-tooltip activator="parent"> 클릭하시면 회원 관리를 위한 창이 띄워집니다. </v-tooltip>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-pagination v-model="solved.paging" :length="5" class="mb-3"></v-pagination>
  </v-card>
</template>

<script setup lang="ts">
import { useAdminReportSolvedStore } from "../../../store/admin/report/solved"
import { useUserStore } from "../../../store/user"

const solved = useAdminReportSolvedStore()
const user = useUserStore()
const PREFIX = process.env.PREFIX || ""
</script>

<style scoped>
.underline {
  border-bottom: #eceff1 1px solid;
}
</style>
