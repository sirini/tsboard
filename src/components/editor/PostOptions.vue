<script setup lang="ts">
import type { Pair } from "@/types/common"
import { CheckboxField } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SelectField } from "@/components/ui/select"
defineProps<{ categories: Pair[]; isAdmin: boolean }>()
const category = defineModel<number>("category", { default: 0 })
const secret = defineModel<boolean>("secret", { default: false })
const notice = defineModel<boolean>("notice", { default: false })
</script>
<template>
  <div class="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
    <div v-if="categories.length" class="space-y-2">
      <Label>{{ $t("editor.category") }}</Label
      ><SelectField v-model="category"
        ><option :value="0">{{ $t("editor.noCategory") }}</option>
        <option v-for="item in categories" :key="item.uid" :value="item.uid">
          {{ item.name }}
        </option></SelectField
      >
    </div>
    <div class="flex flex-wrap items-end gap-5 pb-2">
      <CheckboxField v-model="secret" :label="$t('editor.secret')" /><CheckboxField
        v-if="isAdmin"
        v-model="notice"
        :label="$t('editor.notice')"
      />
    </div>
  </div>
</template>
