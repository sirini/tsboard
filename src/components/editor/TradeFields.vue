<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import type { TradeForm } from "@/types/board"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectField } from "@/components/ui/select"
const model = defineModel<TradeForm>({ required: true })
const { tm } = useI18n()
const conditions = computed(() => tm("thread.conditions") as string[])
const priceTypes = computed(() => tm("editor.priceTypes") as string[])
const deliveryTypes = computed(() => tm("editor.deliveryTypes") as string[])
</script>
<template>
  <fieldset class="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
    <legend class="px-2 text-sm font-semibold">{{ $t("editor.tradeDetails") }}</legend>
    <div class="space-y-2">
      <Label for="brand">{{ $t("editor.brand") }}</Label
      ><Input id="brand" v-model="model.brand" :placeholder="$t('editor.brandPlaceholder')" />
    </div>
    <div class="space-y-2">
      <Label for="price">{{ $t("editor.price") }}</Label>
      <div class="flex gap-2">
        <Input id="price" v-model="model.price" type="number" min="0" /><Input
          v-model="model.currency"
          class="w-24 uppercase"
          maxlength="3"
          :aria-label="$t('editor.currency')"
        />
      </div>
    </div>
    <div class="space-y-2">
      <Label>{{ $t("editor.priceType") }}</Label
      ><SelectField v-model="model.priceType"
        ><option v-for="(label, value) in priceTypes" :key="label" :value="value">
          {{ label }}
        </option></SelectField
      >
    </div>
    <div class="space-y-2">
      <Label>{{ $t("editor.condition") }}</Label
      ><SelectField v-model="model.productCondition"
        ><option v-for="(label, value) in conditions" :key="label" :value="value">
          {{ label }}
        </option></SelectField
      >
    </div>
    <div class="space-y-2">
      <Label for="location">{{ $t("editor.location") }}</Label
      ><Input
        id="location"
        v-model="model.location"
        :placeholder="$t('editor.locationPlaceholder')"
      />
    </div>
    <div class="space-y-2">
      <Label>{{ $t("editor.delivery") }}</Label
      ><SelectField v-model="model.shippingType"
        ><option v-for="(label, value) in deliveryTypes" :key="label" :value="value">
          {{ label }}
        </option></SelectField
      >
    </div>
  </fieldset>
</template>
