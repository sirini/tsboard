<template>
  <v-row>
    <v-col cols="2">
      <v-text-field
        v-model="target"
        variant="outlined"
        type="number"
        density="compact"
        hide-details
        readonly
        prepend-inner-icon="mdi-format-list-numbered"
        append-inner-icon="mdi-chevron-down"
      >
        <v-menu activator="parent" open-on-hover>
          <v-list>
            <v-list-item
              v-for="(_, level) in 10"
              :key="level"
              @click="update(level)"
              :append-icon="target === level ? 'mdi-check' : ''"
            >
              {{ level }} 레벨
            </v-list-item>
          </v-list>
        </v-menu>
      </v-text-field>
    </v-col>
    <v-col class="mt-2"> {{ name }} 레벨 제한을 설정합니다. (0 = 비회원, 9 = 최고레벨) </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue"

const props = defineProps<{
  level: number
  name: string
}>()
const emits = defineEmits<{
  update: [level: number]
}>()
const target = ref<number>(props.level)

// 레벨 변경
function update(level: number): void {
  target.value = level
  emits("update", level)
}
</script>
