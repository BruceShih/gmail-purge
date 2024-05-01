<script lang="ts" setup>
import { useSearchQuery } from '~/composables/useSearchQuery'
import type { Age } from '~/types/gmail/age'
import type { SearchQuery } from '~/types/gmail/searchQuery'

const props = defineProps<{
  labels: gapi.client.gmail.Label[]
  loading: boolean
  modelValue: SearchQuery
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SearchQuery]
  'search': [value: void]
}>()

const { t } = useI18n()
const searchQuery = useSearchQuery()
const data = useVModel(props, 'modelValue', emit)

const selectedCategory = ref(searchQuery.defaultSearchQuery.category.id)
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
const query = reactive<SearchQuery>(data.value)

const allCategories = computed(() => {
  const excludedCategories = ['CHAT', 'SENT', 'INBOX', 'IMPORTANT', 'TRASH', 'DRAFT', 'SPAM', 'STARRED', 'UNREAD']
  return props.labels
    .filter(label => !excludedCategories.includes(label.id || ''))
    .map((label) => {
      return {
        name: capitalizeFirstLetter((label.name || '').toLowerCase().replace('category_', '')),
        value: label.id || ''
      }
    })
})

watch(isRead, (value) => {
  query.isRead = value
})
watch(selectedCategory, (value) => {
  const category = props.labels.find(l => l.id === value)
  if (category)
    query.category = category
})
watch(selectedAge, (value) => {
  query.olderThan = value
})

function onSearchClick(event: MouseEvent): void {
  event.preventDefault()
  emit('search')
}
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <UFormGroup class="mb-4" :label="t('category')">
    <USelect v-model="selectedCategory" :options="allCategories" option-attribute="name" />
  </UFormGroup>
  <UFormGroup class="mb-4" :label="t('age')">
    <USelect v-model="selectedAge" :options="ages" />
  </UFormGroup>
  <UCheckbox v-model="isRead" class="mb-4" name="is-read" :label="t('read')" />
  <UButton class="flex justify-end mb-6" :loading="props.loading" @click="onSearchClick">
    {{ t('search') }}
  </UButton>
</template>
