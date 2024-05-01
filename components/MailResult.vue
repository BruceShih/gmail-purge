<script lang="ts" setup>
const props = defineProps<{
  count: number
  totalCount: number
  totalPages: number
  query: string
  loading: boolean
}>()

const emit = defineEmits<{
  execute: [value: 'trash' | 'delete']
}>()

const { t } = useI18n()

const choice = ref('trash')
const choices = reactive([
  { value: 'trash', label: t('choiceTrash') },
  { value: 'delete', label: t('choiceDelete') }
])

function onExecuteClick() {
  emit('execute', choice.value as 'trash' | 'delete')
}
</script>

<template>
  <UDivider class="mb-4" />
  <p class="mb-4">
    {{ t('searchResult', {
      count: props.count,
      totalCount: props.totalCount,
      totalPages: props.totalPages,
      pageCount: props.totalPages,
    }) }}
  </p>
  <template v-if="props.count > 0">
    <UAlert
      icon="i-lucide-lightbulb"
      :title="t('tips')"
    >
      <template #description>
        <p class="mt-2">
          <code>{{ props.query }}</code>
        </p>
      </template>
    </UAlert>
    <UDivider class="mt-6 mb-4" />
    <p class="mb-4">
      {{ t('whatDoYouWant') }}
    </p>
    <USelect v-model="choice" :options="choices" class="mb-4" />
    <UButton :loading="loading" class="flex justify-end" @click="onExecuteClick">
      {{ t('execute') }}
    </UButton>
  </template>
</template>
