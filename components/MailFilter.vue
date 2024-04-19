<script lang="ts" setup>
import type { Age } from '~/types/gmail/age'
import type { Category } from '~/types/gmail/category'
import type { SearchQuery } from '~/types/gmail/searchQuery'

const emit = defineEmits<{
  update: [value: string]
}>()

const allCategories = ref<Category[]>([
  'primary',
  'social',
  'promotions',
  'updates',
  'forums',
  'reservations',
  'purchases'
])
const age = ref<Age[]>([
  '6m',
  '1y',
  '2y',
  '3y',
  '5y'
])
const isRead = ref(false)
const searchQuery = reactive<SearchQuery>({
  isRead: false,
  category: 'promotions',
  olderThan: '1y'
})
const queryString = ref<string>('is:unread category:promotions older_than:1y')

function onCategorySelect(event: Event): void {
  const target = event.target as HTMLSelectElement
  if (target.value === 'none')
    searchQuery.category = 'promotions'
  else
    searchQuery.category = target.value as Category

  queryString.value = flattenSearchQuery()
  emit('update', queryString.value)
}
function onAgeSelect(event: Event): void {
  const target = event.target as HTMLSelectElement
  if (target.value === 'none')
    searchQuery.olderThan = '1y'
  else
    searchQuery.olderThan = target.value as Age

  queryString.value = flattenSearchQuery()
  emit('update', queryString.value)
}
function onIsReadChange(event: Event): void {
  const target = event.target as HTMLInputElement
  searchQuery.isRead = target.checked

  queryString.value = flattenSearchQuery()
  emit('update', queryString.value)
}

function flattenSearchQuery(): string {
  return `is:${searchQuery.isRead ? 'read' : 'unread'} category:${searchQuery.category} older_than:${searchQuery.olderThan}`
}
</script>

<template>
  <select id="category" name="category" @change="onCategorySelect">
    <option value="none" selected>
      Select category
    </option>
    <option v-for="category in allCategories" :key="category" :value="category">
      {{ category }}
    </option>
  </select>
  <select id="age" name="age" @change="onAgeSelect">
    <option value="none" selected>
      Select age
    </option>
    <option v-for="length in age" :key="length" :value="length">
      {{ length }}
    </option>
  </select>
  <label for="is-read">Read</label>
  <input id="is-read" v-model="isRead" type="checkbox" name="is-read" @change="onIsReadChange">
</template>
