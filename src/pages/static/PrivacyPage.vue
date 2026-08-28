<script setup lang="ts">
import StaticPage from "@/components/common/StaticPage.vue"
import { TSBOARD } from "../../../tsboard.config"
</script>
<template>
  <StaticPage
    :eyebrow="$t('static.legal')"
    :title="$t('static.privacyTitle')"
    :description="$t('static.privacyDescription')"
    ><h2>{{ $t("static.privacyCollectedTitle") }}</h2>
    <p>{{ $t("static.privacyCollected") }}</p>
    <h2>{{ $t("static.privacyPurposeTitle") }}</h2>
    <p>{{ $t("static.privacyPurpose") }}</p>
    <h2>{{ $t("static.privacyCookiesTitle") }}</h2>
    <p>{{ $t("static.privacyCookies") }}</p>
    <h2>{{ $t("static.privacyRetentionTitle") }}</h2>
    <p>{{ $t("static.privacyRetention") }}</p>
    <h2>{{ $t("static.contactTitle") }}</h2>
    <p>{{ $t("static.privacyContact", { email: TSBOARD.adminEmail }) }}</p></StaticPage
  >
</template>
