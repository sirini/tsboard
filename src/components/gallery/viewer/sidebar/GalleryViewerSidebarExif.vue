<template>
  <v-card
    elevation="0"
    variant="tonal"
    class="mt-2 mb-2"
    v-if="viewer.exifs[viewer.position]?.width > 0"
  >
    <v-card-text class="pa-0">
      <v-table density="compact" :theme="isMobile ? 'dark' : 'light'">
        <tbody>
          <tr>
            <td>{{ TEXT[home.lang].MAKER }} ({{ TEXT[home.lang].MODEL }})</td>
            <td>
              {{ viewer.exifs[viewer.position].make }} ({{ viewer.exifs[viewer.position].model }})
            </td>
          </tr>
          <tr>
            <td>{{ TEXT[home.lang].APERTURE }}</td>
            <td>{{ viewer.exifs[viewer.position].aperture }}</td>
          </tr>
          <tr>
            <td>{{ TEXT[home.lang].ISO }}</td>
            <td>{{ viewer.exifs[viewer.position].iso }}</td>
          </tr>
          <tr>
            <td>{{ TEXT[home.lang].FOCAL_LENGTH }}</td>
            <td>{{ viewer.exifs[viewer.position].focalLength }} mm</td>
          </tr>
          <tr>
            <td>{{ TEXT[home.lang].EXPOSURE }}</td>
            <td>{{ viewer.exifs[viewer.position].exposure * 1000 }} ms</td>
          </tr>
          <tr>
            <td>{{ TEXT[home.lang].IMAGE_SIZE }}</td>
            <td>
              {{ viewer.exifs[viewer.position].width }} x
              {{ viewer.exifs[viewer.position].height }}
            </td>
          </tr>
          <tr>
            <td>{{ TEXT[home.lang].DATE }}</td>
            <td>{{ util.date(viewer.exifs[viewer.position].date, true, true) }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../../store/board/gallery/viewer"
import { useHomeStore } from "../../../../store/home"
import { useUtilStore } from "../../../../store/util"
import { TEXT } from "../../../../messages/components/gallery/viewer/gallery-viewer"

const viewer = useViewerStore()
const home = useHomeStore()
const util = useUtilStore()
const props = defineProps<{
  isMobile: boolean
}>()
</script>
