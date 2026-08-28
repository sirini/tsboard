<script setup lang="ts">
import StaticPage from "@/components/common/StaticPage.vue"
import { TSBOARD } from "../../../tsboard.config"
</script>
<template>
  <StaticPage
    eyebrow="Legal"
    title="Terms of use"
    description="Simple rules for a healthy community."
    ><p>
      By using {{ TSBOARD.siteName }}, you agree to follow applicable law and the rules published by
      the site operator.
    </p>
    <h2>Your account</h2>
    <p>
      You are responsible for activity performed through your account. Keep your credentials private
      and report suspected misuse to the administrator.
    </p>
    <h2>Your content</h2>
    <p>
      You retain ownership of content you submit. You grant the site permission to store, process,
      and display it as needed to operate the community. Do not submit material you do not have the
      right to share.
    </p>
    <h2>Moderation</h2>
    <p>
      Administrators may restrict accounts or remove content to protect members, comply with law, or
      enforce community rules. Service availability is not guaranteed.
    </p>
    <h2>Contact</h2>
    <p>
      Questions about these terms may be sent to
      <a :href="`mailto:${TSBOARD.adminEmail}`">{{ TSBOARD.adminEmail }}</a
      >.
    </p></StaticPage
  >
</template>
