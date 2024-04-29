<script lang="ts" setup>
import type { Age } from '~/types/gmail/age'
import type { Category } from '~/types/gmail/category'
import type { SearchQuery } from '~/types/gmail/searchQuery'

const props = defineProps<{
  loading: boolean
  modelValue: SearchQuery
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SearchQuery]
  'search': [value: void]
}>()

const data = useVModel(props, 'modelValue', emit)

const allCategories = ref<Category[]>([
  'social',
  'promotions',
  'forums'
])
const selectedCategory = ref<Category>('promotions')
const ages = ref<Age[]>([
  'all',
  '6m',
  '1y',
  '2y',
  '3y',
  '5y'
])
const selectedAge = ref<Age>('all')
const isRead = ref(false)
const searchQuery = reactive<SearchQuery>(data.value)

watch(isRead, (value) => {
  searchQuery.isRead = value
})
watch(selectedCategory, (value) => {
  searchQuery.category = value
})
watch(selectedAge, (value) => {
  searchQuery.olderThan = value
})

function onSearchClick(event: MouseEvent): void {
  event.preventDefault()
  emit('search')
}
</script>

<template>
  <UFormGroup class="mb-4" label="Category">
    <USelect v-model="selectedCategory" :options="allCategories" />
  </UFormGroup>
  <UFormGroup class="mb-4" label="Age">
    <USelect v-model="selectedAge" :options="ages" />
  </UFormGroup>
  <UCheckbox v-model="isRead" class="mb-4" name="is-read" label="Read" />
  <UButton class="flex justify-end mb-6" :loading="props.loading" @click="onSearchClick">
    Search
  </UButton>
</template>
