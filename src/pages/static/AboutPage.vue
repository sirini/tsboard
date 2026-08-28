<script setup lang="ts">
import StaticPage from "@/components/common/StaticPage.vue"
import { TSBOARD } from "../../../tsboard.config"
</script>
<template>
  <StaticPage
    :eyebrow="$t('static.aboutEyebrow')"
    :title="$t('static.aboutTitle')"
    :description="$t('static.aboutDescription')"
    ><h2>{{ $t("static.aboutOriginTitle") }}</h2>
    <p>{{ $t("static.aboutOriginOne") }}</p>
    <p>{{ $t("static.aboutOriginTwo", { version: TSBOARD.version }) }}</p>
    <h2>{{ $t("static.aboutChoicesTitle") }}</h2>
    <ul>
      <li>{{ $t("static.aboutChoiceSpa") }}</li>
      <li>{{ $t("static.aboutChoiceUi") }}</li>
      <li>{{ $t("static.aboutChoiceReddit") }}</li>
      <li>{{ $t("static.aboutChoiceTheme") }}</li>
      <li>{{ $t("static.aboutChoiceContract") }}</li>
    </ul>
    <h2>{{ $t("static.aboutNotTitle") }}</h2>
    <p>{{ $t("static.aboutNot") }}</p></StaticPage
  >
</template>
