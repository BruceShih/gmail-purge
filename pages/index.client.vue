<script setup lang="ts">
import type { AuthCodeFlowErrorResponse, AuthCodeFlowSuccessResponse } from 'vue3-google-signin'
import { useGmailApi } from '~/composables/api/useGmailApi'

const api = useGmailApi()
const mails = ref<gapi.client.gmail.Message[]>([])
const nextPageToken = ref('')
const searchQuery = ref('')
const isLoggedIn = ref(false)

const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
  scope: 'https://mail.google.com/'
})

function handleOnSuccess(response: AuthCodeFlowSuccessResponse): void {
  api.setToken(response.access_token)
  isLoggedIn.value = true
}
function handleOnError(errorResponse: AuthCodeFlowErrorResponse): void {
  console.error('Error: ', errorResponse)
}
function onFilterUpdate(value: string): void {
  searchQuery.value = value
}
async function onSearchClick() {
  const response = await api.list(searchQuery.value)
  // eslint-disable-next-line no-console
  console.log(response)
  mails.value = response.messages || []
  nextPageToken.value = response.nextPageToken || ''
}
</script>

<template>
  <button v-if="!isLoggedIn" :disabled="!isReady" @click="() => login()">
    Login with Google
  </button>
  <br>
  <MailFilter @update="onFilterUpdate" />
  <button @click="onSearchClick">
    Search
  </button>
  <MailList :messages="mails" />
</template>
