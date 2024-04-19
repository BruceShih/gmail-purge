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
  mails.value = response.messages || []
  nextPageToken.value = response.nextPageToken || ''
}
</script>

<template>
  <UContainer>
    <h1 class="text-center mt-6 mb-3 text-4xl">
      Gmail Purge
    </h1>
    <p class="text-center mb-8">
      Purge your promotion mails in your gmail
    </p>
    <UButton v-if="!isLoggedIn" class="flex mx-auto" :disabled="!isReady" @click="() => login()">
      Login with <UIcon class="w-12" name="i-logos-google" />
    </UButton>
    <template v-if="isLoggedIn">
      <UDivider class="mb-6" />
      <MailFilter @update="onFilterUpdate" @search="onSearchClick" />
      <MailList :messages="mails" />
    </template>
  </UContainer>
</template>
