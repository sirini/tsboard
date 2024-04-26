<template>
  <v-card elevation="0">
    <v-list>
      <v-list-subheader>신고 내용 검색</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item class="mt-3 mb-3">
        <template v-slot:prepend>
          <v-btn-toggle v-model="report.option" mandatory class="mt-1">
            <v-btn value="from">신고자명</v-btn>
            <v-btn value="request">내용</v-btn>
            <v-btn value="to">대상자명</v-btn>
          </v-btn-toggle>
        </template>

        <v-text-field
          variant="outlined"
          v-model="report.keyword"
          hide-details
          class="ml-5 mt-1 mr-1"
          prepend-inner-icon="mdi-restore"
          append-inner-icon="mdi-magnify"
          @keyup="report.updateReports"
          @click:prepend-inner="report.resetKeyword"
          @click:append-inner="report.updateReports"
        >
          <v-tooltip activator="parent"
            >검색어를 입력해 보세요.<br />초기 목록을 보려면 왼쪽의 반시계 방향 아이콘을 클릭하세요.
          </v-tooltip>
        </v-text-field>

        <template v-slot:append>
          <v-select
            v-model="report.bunch"
            variant="outlined"
            hide-details
            class="mt-1"
            :items="[5, 10, 15, 20, 25, 30, 40, 50, 100]"
          ></v-select>
        </template>
      </v-list-item>

      <v-list-subheader>신고 내용 목록 (신고 대상 / 신고 내용 / 신고자)</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item v-for="(list, index) in report.reports" :key="index" class="underline">
        <template v-slot:prepend>
          <v-chip
            :prepend-avatar="
              list.to.profile.length < 1 ? `${TSBOARD.PREFIX}/no-profile.svg` : list.to.profile
            "
            color="red"
            class="mt-1"
            size="small"
            >{{ list.to.name }}</v-chip
          ></template
        >

        <div class="ml-2 mr-2">
          {{ list.request }}
          <v-card class="mt-2 mb-2 pa-0 response" v-if="report.isSolved" elevation="0">
            <v-icon color="success" class="mr-2 mb-1" size="small">mdi-check-circle</v-icon
            >{{ list.response }}
          </v-card>
          <v-chip v-else label color="blue-grey-lighten-3" size="small">{{
            util.date(list.date)
          }}</v-chip>
        </div>

        <template v-slot:append
          ><v-chip
            :prepend-avatar="
              list.from.profile.length < 1 ? `${TSBOARD.PREFIX}/no-profile.svg` : list.from.profile
            "
            color="blue-grey"
            class="mt-1"
            size="small"
            >{{ list.from.name }}</v-chip
          >
          <v-btn
            elevation="0"
            icon
            @click="
              manage.openManageUser({
                uid: list.to.uid,
                name: list.to.name,
                profile: list.to.profile,
              })
            "
            class="ml-2"
            ><v-icon>mdi-account-cog</v-icon>
            <v-tooltip activator="parent">
              클릭하시면 {{ list.to.name }}님의 권한 관리를 위한 창이 띄워집니다.</v-tooltip
            >
          </v-btn>
        </template>
      </v-list-item>
    </v-list>

    <paging
      :page="report.page"
      :page-length="report.pageLength"
      @prev="report.page -= 1"
      @next="report.page += 1"
    ></paging>
  </v-card>
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue"
import { useAdminReportStore } from "../../../store/admin/report/common"
import { useManageUserStore } from "../../../store/user/manageuser"
import { useUtilStore } from "../../../store/util"
import { TSBOARD } from "../../../../tsboard.config"
import Paging from "../common/AdminBottomPaging.vue"

const report = useAdminReportStore()
const manage = useManageUserStore()
const util = useUtilStore()

onMounted(() => report.loadReports())
watch(
  () => [report.page, report.bunch, report.isSolved],
  () => report.loadReports(),
)
</script>

<style scoped>
.underline {
  border-bottom: #eceff1 1px solid;
}
.response {
  color: #4caf50;
}
</style>
