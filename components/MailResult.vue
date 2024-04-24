<script lang="ts" setup>
const props = defineProps<{
  total: number
  query: string
  loading: boolean
}>()

const emit = defineEmits<{
  execute: [value: 'trash' | 'delete']
}>()

const choices = [
  { value: 'trash', label: 'Mark all as read and move to trash' },
  { value: 'delete', label: 'Delete all (cannot be undone)' }
]

const choice = ref('trash')

function onExecuteClick() {
  emit('execute', choice.value as 'trash' | 'delete')
}
</script>

<template>
  <UDivider class="mb-4" />
  <p class="mb-4">
    Found {{ props.total }} mails
  </p>
  <template v-if="props.total > 0">
    <UAlert
      icon="i-lucide-lightbulb"
      title="Copy the text below and paste it in Gmail's search box to view these mails"
    >
      <template #description>
        <p class="mt-2">
          <code>{{ props.query }}</code>
        </p>
      </template>
    </UAlert>
    <UDivider class="mt-6 mb-4" />
    <p class="mb-4">
      What do you want to do?
    </p>
    <USelect v-model="choice" :options="choices" class="mb-4" />
    <UButton :loading="loading" class="flex justify-end" @click="onExecuteClick">
      Execute
    </UButton>
  </template>
</template>
