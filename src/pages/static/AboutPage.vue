<script setup lang="ts">
import StaticPage from "@/components/common/StaticPage.vue"
import { TSBOARD } from "../../../tsboard.config"
</script>
<template>
  <StaticPage
    eyebrow="About"
    title="A small board with a long memory"
    description="TSBOARD is the lightweight SPA sibling of NUBO."
    ><h2>Where it came from</h2>
    <p>
      TSBOARD began as an experiment by a developer returning to the web after the PHP 4 era. Vue,
      TypeScript, and Go turned that experiment into a fast community platform used for photography
      and internal communities.
    </p>
    <p>
      NUBO later carried the platform forward with Nuxt, SSR, SEO, and a full skin ecosystem.
      TSBOARD {{ TSBOARD.version }} revisits the original idea from another direction: what if a
      modern community needs the current GOAPI contract and excellent mobile UX, but cannot justify
      an SSR server?
    </p>
    <h2>What TSBOARD chooses</h2>
    <ul>
      <li>A Vue SPA that can be served as static files.</li>
      <li>One carefully designed shadcn-vue interface instead of a skin system.</li>
      <li>A Reddit-inspired feed, threads, and nested conversations.</li>
      <li>Light and dark themes, responsive from phones to wide desktops.</li>
      <li>English interface text and the same GOAPI v1 contract used by NUBO 1.3.0.</li>
    </ul>
    <h2>What it does not try to be</h2>
    <p>
      TSBOARD does not render pages on the server, generate a sitemap, or promise search-engine
      parity with NUBO. It is the practical choice for private communities, modest servers, and
      deployments where a static frontend is a feature.
    </p></StaticPage
  >
</template>
