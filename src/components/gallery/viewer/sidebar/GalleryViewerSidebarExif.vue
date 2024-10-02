<template>
  <v-card elevation="0" class="mt-2 mb-2" variant="tonal">
    <v-card-text class="pa-0">
      <v-table density="compact" class="text-caption">
        <tbody>
          <tr>
            <td>{{ TEXT[home.lang].MAKER }}</td>
            <td>{{ viewer.images[viewer.position].exif.make }}</td>
          </tr>
          <tr>
            <td>{{ TEXT[home.lang].MODEL }}</td>
            <td>{{ viewer.images[viewer.position].exif.model }}</td>
          </tr>
          <tr>
            <td>{{ TEXT[home.lang].APERTURE }}</td>
            <td>{{ viewer.images[viewer.position].exif.aperture }}</td>
          </tr>
          <tr>
            <td>{{ TEXT[home.lang].ISO }}</td>
            <td>{{ viewer.images[viewer.position].exif.iso }}</td>
          </tr>
          <tr>
            <td>{{ TEXT[home.lang].FOCAL_LENGTH }}</td>
            <td>{{ viewer.images[viewer.position].exif.focalLength }} mm</td>
          </tr>
          <tr>
            <td>{{ TEXT[home.lang].EXPOSURE }}</td>
            <td>{{ viewer.images[viewer.position].exif.exposure * 1000 }} ms</td>
          </tr>
          <tr>
            <td>{{ TEXT[home.lang].IMAGE_SIZE }}</td>
            <td>
              {{ viewer.images[viewer.position].exif.width }} x
              {{ viewer.images[viewer.position].exif.height }}
            </td>
          </tr>
          <tr>
            <td>{{ TEXT[home.lang].DATE }}</td>
            <td>{{ util.date(viewer.images[viewer.position].exif.date, true, true) }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { TEXT } from "../../../../messages/components/gallery/viewer/gallery-viewer"
import { useViewerStore } from "../../../../store/board/gallery/viewer"
import { useHomeStore } from "../../../../store/home"
import { useUtilStore } from "../../../../store/util"

const viewer = useViewerStore()
const home = useHomeStore()
const util = useUtilStore()
</script>
