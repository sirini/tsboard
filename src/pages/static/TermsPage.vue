<script setup lang="ts">
import StaticPage from "@/components/common/StaticPage.vue"
import { TSBOARD } from "../../../tsboard.config"
</script>
<template>
  <StaticPage
    :eyebrow="$t('static.legal')"
    :title="$t('static.termsTitle')"
    :description="$t('static.termsDescription')"
    ><p>{{ $t("static.termsIntro", { site: TSBOARD.siteName }) }}</p>
    <h2>{{ $t("static.termsAccountTitle") }}</h2>
    <p>{{ $t("static.termsAccount") }}</p>
    <h2>{{ $t("static.termsContentTitle") }}</h2>
    <p>{{ $t("static.termsContent") }}</p>
    <h2>{{ $t("static.termsModerationTitle") }}</h2>
    <p>{{ $t("static.termsModeration") }}</p>
    <h2>{{ $t("static.contactTitle") }}</h2>
    <p>{{ $t("static.termsContact", { email: TSBOARD.adminEmail }) }}</p></StaticPage
  >
</template>
