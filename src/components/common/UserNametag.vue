<template>
  <v-chip class="pointer" :size="size || 'small'">
    <v-avatar start>
      <v-img :src="profile"></v-img>
    </v-avatar>
    {{ name }}

    <v-menu activator="parent">
      <v-list density="compact">
        <v-list-item prepend-icon="mdi-card-account-details-outline"> 정보 보기 </v-list-item>
        <v-list-item prepend-icon="mdi-account-filter-outline"> 글 모아 보기 </v-list-item>
        <v-list-item prepend-icon="mdi-card-account-mail-outline">쪽지 보내기</v-list-item>
        <v-list-item prepend-icon="mdi-account-tie-hat-outline">신고하기</v-list-item>
        <v-list-item prepend-icon="mdi-account-cog">회원 관리</v-list-item>
      </v-list>
    </v-menu>
  </v-chip>
</template>

<script setup lang="ts">
const props = defineProps<{
  uid: number
  profile: string
  name: string
  size?: string
}>()
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
