<script lang="ts" setup>
import { useGmailApi } from '~/composables/api/useGmailApi'

const props = defineProps<{
  messages: gapi.client.gmail.Message[]
}>()

const api = useGmailApi()
const selected = ref<string[]>([])
const columns = [{
  key: 'id'
}, {
  key: 'snippet',
  label: 'Snippet'
}]
const items = ref<gapi.client.gmail.Message[]>([])

onMounted(() => {
  const promises: Promise<gapi.client.gmail.Message>[] = []
  props.messages.map(async (message) => {
    if (!message.id)
      return

    promises.push(api.get(message.id))
  })

  Promise.allSettled(promises).then((results) => {
    items.value = results.map((result) => {
      if (result.status === 'fulfilled') {
        return {
          id: result.value.id || '',
          snippet: result.value.snippet || ''
        }
      }
      else { return {} }
    })
  })
})
</script>

<template>
  <UContainer>
    <UTable v-model="selected" :columns="columns" :rows="items" />
  </UContainer>
</template>
