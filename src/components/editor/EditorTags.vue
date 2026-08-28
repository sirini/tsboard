<script setup lang="ts">
import { Hash, X } from "lucide-vue-next"
import { ref } from "vue"
import { editorApi } from "@/api/editor"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { EditorTag } from "@/types/content"

const tags = defineModel<string[]>({ required: true })
const tagText = ref("")
const suggestions = ref<EditorTag[]>([])

const search = async () => {
  const value = tagText.value.trim()
  if (value.length < 2) return void (suggestions.value = [])
  const response = await editorApi.tags(value)
  if (response.success) suggestions.value = response.result
}

const add = (value = tagText.value) => {
  const clean = value.trim().replace(/[^\p{L}\p{N}_-]/gu, "")
  if (clean && !tags.value.includes(clean)) tags.value.push(clean)
  tagText.value = ""
  suggestions.value = []
}
</script>

<template>
  <div class="space-y-2">
    <Label for="tags">{{ $t("editor.tags") }}</Label>
    <div class="flex gap-2">
      <Input
        id="tags"
        v-model="tagText"
        :placeholder="$t('editor.tagPlaceholder')"
        @input="search"
        @keydown.enter.prevent="add()"
      />
      <Button type="button" variant="secondary" @click="add()"
        ><Hash />{{ $t("editor.add") }}</Button
      >
    </div>
    <div v-if="suggestions.length" class="flex flex-wrap gap-2">
      <button v-for="suggestion in suggestions" :key="suggestion.uid" @click="add(suggestion.name)">
        <Badge variant="outline">#{{ suggestion.name }} · {{ suggestion.count }}</Badge>
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      <Badge v-for="(tag, index) in tags" :key="tag" variant="secondary">
        #{{ tag }}
        <button class="ml-1" :aria-label="$t('editor.removeTag')" @click="tags.splice(index, 1)">
          <X class="size-3" />
        </button>
      </Badge>
    </div>
  </div>
</template>
