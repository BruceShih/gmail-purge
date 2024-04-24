<script setup lang="ts">
import type { AuthCodeFlowErrorResponse, AuthCodeFlowSuccessResponse } from 'vue3-google-signin'
import { useGmailApi } from '~/composables/api/useGmailApi'
import { notEmpty } from '~/helpers/filters'

const api = useGmailApi()
const mails = ref<gapi.client.gmail.Message[]>([])
const total = ref(0)
const searchLoading = ref(false)
const executeLoading = ref(false)
const nextPageToken = ref('')
const searchQuery = ref('')
const showResult = ref(false)
const isLoggedIn = ref(false)

const toast = useToast()

const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
  scope: 'https://mail.google.com/'
})

function handleOnSuccess(response: AuthCodeFlowSuccessResponse) {
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
  try {
    showResult.value = true
    searchLoading.value = true
    const response = await api.list(searchQuery.value)
    mails.value = response.messages || []
    nextPageToken.value = response.nextPageToken || ''
    total.value = response.resultSizeEstimate || 0
  }
  catch (error) {
    console.error(error)
  }
  finally {
    searchLoading.value = false
  }
}

async function onExecuteClick(value: 'trash' | 'delete') {
  const ids = mails.value.map(mail => mail.id || '').filter(id => notEmpty(id))

  try {
    executeLoading.value = true
    if (value === 'trash')
      await api.batchModify(ids)
    else
      await api.batchDelete(ids)

    toast.add({
      title: 'Operation successful',
      icon: 'i-lucide-check',
      color: 'primary',
      callback: () => {
        reloadNuxtApp()
      }
    })
  }
  catch (error) {
    console.error(error)
    toast.add({ title: 'Operation failed', icon: 'i-lucide-x', color: 'red' })
  }
  finally {
    executeLoading.value = false
  }
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
    <UAlert
      class="mb-4"
      description="Site don't store or send any of user data, which means you have to login every time if you reload the site."
      title="Note"
    />
    <UButton v-if="!isLoggedIn" class="flex mx-auto" :disabled="!isReady" @click="() => login()">
      Login with <UIcon class="w-12" name="i-logos-google" />
    </UButton>
    <template v-if="isLoggedIn">
      <MailFilter :loading="searchLoading" @update="onFilterUpdate" @search="onSearchClick" />
      <template v-if="showResult">
        <MailResult
          v-if="!searchLoading" :loading="executeLoading" :total="total" :query="searchQuery"
          @execute="onExecuteClick"
        />
        <template v-else>
          <USkeleton class="h-6 mb-4 w-full" />
          <USkeleton class="h-28 w-full" />
          <USkeleton class="h-10 w-full" />
          <USkeleton class="h-6 mb-4 w-full" />
          <USkeleton class="h-8 mb-4 w-full" />
          <USkeleton class="h-8 mb-4 w-20" />
        </template>
      </template>
    </template>
  </UContainer>
</template>
