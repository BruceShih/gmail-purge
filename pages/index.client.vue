<script setup lang="ts">
import type { AuthCodeFlowErrorResponse, AuthCodeFlowSuccessResponse } from 'vue3-google-signin'
import { useGmailApi } from '~/composables/api/useGmailApi'

const api = useGmailApi()
const mails = ref<gapi.client.gmail.Message[]>([])
const total = ref(0)
const searchLoading = ref(false)
const nextPageToken = ref('')
const searchQuery = ref('')
const showResult = ref(false)
const isLoggedIn = ref(false)

const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
  scope: 'https://mail.google.com/'
})

function handleOnSuccess(response: AuthCodeFlowSuccessResponse) {
  api.setToken(response.access_token)
  // api.labels().then(response => labels.value = response || [])
  isLoggedIn.value = true
}
function handleOnError(errorResponse: AuthCodeFlowErrorResponse): void {
  console.error('Error: ', errorResponse)
}
function onFilterUpdate(value: string): void {
  searchQuery.value = value
}
async function onSearchClick() {
  showResult.value = true
  searchLoading.value = true
  const response = await api.list(searchQuery.value)
  searchLoading.value = false
  mails.value = response.messages || []
  nextPageToken.value = response.nextPageToken || ''
  total.value = response.resultSizeEstimate || 0
}
</script>

<template>
  <UContainer>
    <h1 class="text-center mt-6 mb-3 text-4xl">
      Gmail Purge
    </h1>
    <p class="text-center mb-8">
      Purge your mails in your gmail inbox
    </p>
    <UButton v-if="!isLoggedIn" class="flex mx-auto" :disabled="!isReady" @click="() => login()">
      Login with <UIcon class="w-12" name="i-logos-google" />
    </UButton>
    <template v-if="isLoggedIn">
      <MailFilter :loading="searchLoading" @update="onFilterUpdate" @search="onSearchClick" />
      <template v-if="showResult">
        <MailResult v-if="!searchLoading" :total="total" :query="searchQuery" />
        <UContainer v-else>
          <USkeleton class="h-6 mb-4 w-full" />
          <USkeleton class="h-28 w-full" />
          <USkeleton class="h-10 w-full" />
          <USkeleton class="h-6 mb-4 w-full" />
          <USkeleton class="h-8 mb-4 w-full" />
          <USkeleton class="h-8 mb-4 w-20" />
        </UContainer>
      </template>
    </template>
  </UContainer>
</template>
