<script setup lang="ts">
import StaticPage from "@/components/common/StaticPage.vue"
import { TSBOARD } from "../../../tsboard.config"
</script>
<template>
  <StaticPage
    eyebrow="Legal"
    title="Privacy policy"
    description="How this TSBOARD installation handles member data."
    ><h2>Information collected</h2>
    <p>
      The service processes account identifiers, profile information, posts, comments, messages,
      uploaded files, security records, and basic request metadata needed to operate safely.
    </p>
    <h2>Why it is used</h2>
    <p>
      Data is used to authenticate members, deliver community features, prevent abuse, send
      requested email, and maintain service reliability. It is not sold by TSBOARD.
    </p>
    <h2>Cookies</h2>
    <p>
      Secure HttpOnly cookies maintain your access and refresh sessions. A small local preference
      stores your light or dark theme, and local draft storage protects unfinished posts.
    </p>
    <h2>Retention and deletion</h2>
    <p>
      Retention depends on the operator's legal and operational obligations. Signed-in members can
      request permanent account deletion from their profile. Backups may expire on a separate
      schedule.
    </p>
    <h2>Contact</h2>
    <p>
      Privacy requests may be sent to
      <a :href="`mailto:${TSBOARD.adminEmail}`">{{ TSBOARD.adminEmail }}</a
      >.
    </p></StaticPage
  >
</template>
