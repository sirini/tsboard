<script setup lang="ts">
import type { TradeForm } from "@/types/board"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectField } from "@/components/ui/select"
const model = defineModel<TradeForm>({ required: true })
</script>
<template>
  <fieldset class="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
    <legend class="px-2 text-sm font-semibold">Marketplace details</legend>
    <div class="space-y-2">
      <Label for="brand">Brand</Label
      ><Input id="brand" v-model="model.brand" placeholder="Brand or maker" />
    </div>
    <div class="space-y-2">
      <Label for="price">Price</Label>
      <div class="flex gap-2">
        <Input id="price" v-model="model.price" type="number" min="0" /><Input
          v-model="model.currency"
          class="w-24 uppercase"
          maxlength="3"
          aria-label="Currency"
        />
      </div>
    </div>
    <div class="space-y-2">
      <Label>Price type</Label
      ><SelectField v-model="model.priceType"
        ><option :value="0">Fixed</option>
        <option :value="1">Negotiable</option>
        <option :value="2">Free</option></SelectField
      >
    </div>
    <div class="space-y-2">
      <Label>Condition</Label
      ><SelectField v-model="model.productCondition"
        ><option :value="0">Unopened</option>
        <option :value="1">Like new</option>
        <option :value="2">Used</option>
        <option :value="3">Worn</option>
        <option :value="4">Damaged</option></SelectField
      >
    </div>
    <div class="space-y-2">
      <Label for="location">Location</Label
      ><Input id="location" v-model="model.location" placeholder="City or region" />
    </div>
    <div class="space-y-2">
      <Label>Delivery</Label
      ><SelectField v-model="model.shippingType"
        ><option :value="0">Shipping</option>
        <option :value="1">Local meetup</option>
        <option :value="2">Either</option></SelectField
      >
    </div>
  </fieldset>
</template>
