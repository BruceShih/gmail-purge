<script lang="ts" setup>
import { useGmailApi } from '~/composables/api/useGmailApi'

const props = defineProps<{
  messages: gapi.client.gmail.Message[]
}>()

const api = useGmailApi()

async function onViewMessageClick(id?: string) {
  if (!id)
    return

  const response = await api.get(id)
  // eslint-disable-next-line no-console
  console.log(response)
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>id</th>
        <th>threadId</th>
        <th>view</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="message in props.messages" :key="message.id">
        <td>
          {{ message.id }}
        </td>
        <td>
          {{ message.threadId }}
        </td>
        <td>
          <button @click="onViewMessageClick(message.id)">
            View
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
