<script lang="ts" setup>
import type { Age } from '~/types/gmail/age'
import type { Category } from '~/types/gmail/category'
import type { SearchQuery } from '~/types/gmail/searchQuery'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  update: [value: string]
  search: [value: void]
}>()

const allCategories = ref<Category[]>([
  'social',
  'promotions',
  'forums'
])
const selectedCategory = ref<Category>('promotions')
const ages = ref<Age[]>([
  'none',
  '6m',
  '1y',
  '2y',
  '3y',
  '5y'
])
const selectedAge = ref<Age>('none')
const isRead = ref(false)
const searchQuery = reactive<SearchQuery>({
  isRead: false,
  category: 'promotions',
  olderThan: 'none'
})
const queryString = ref<string>(flattenSearchQuery())

watchEffect(() => {
  searchQuery.isRead = isRead.value
  searchQuery.category = selectedCategory.value
  searchQuery.olderThan = selectedAge.value

  queryString.value = flattenSearchQuery()
  emit('update', queryString.value)
})

function onSearchClick(event: MouseEvent): void {
  event.preventDefault()
  emit('search')
}

function flattenSearchQuery(): string {
  return `is:${searchQuery.isRead ? 'read' : 'unread'} \
  category:${searchQuery.category} \
  ${searchQuery.olderThan === 'none' ? '' : `older_than:${searchQuery.olderThan}`}`
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
