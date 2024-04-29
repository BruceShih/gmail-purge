<script setup lang="ts">
import type { AuthCodeFlowErrorResponse, AuthCodeFlowSuccessResponse } from 'vue3-google-signin'
import { useGmailApi } from '~/composables/api/useGmailApi'
import { notEmpty } from '~/helpers/filters'
import { categoryMapping } from '~/types/gmail/category'
import type { SearchQuery } from '~/types/gmail/searchQuery'

const api = useGmailApi()
const mails = ref<gapi.client.gmail.Message[]>([])
const count = ref(0)
const total = ref(0)
const totalUnread = ref(0)
const searchLoading = ref(false)
const executeLoading = ref(false)
const totalPages = ref(0)
const pageSize = ref(500)
const nextPageToken = ref('')
const searchQuery = reactive<SearchQuery>({
  isRead: false,
  category: 'promotions',
  olderThan: 'none'
})
const searchQueryString = ref<string>(flattenSearchQuery())
const showResult = ref(false)
const isLoggedIn = ref(false)

const toast = useToast()

const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
  scope: 'https://mail.google.com/'
})

watch(searchQuery, () => {
  showResult.value = false
  searchQueryString.value = flattenSearchQuery()
})

function handleOnSuccess(response: AuthCodeFlowSuccessResponse) {
  api.setToken(response.access_token)
  api.setPageSize(pageSize.value)
  // api.labels.list()
  isLoggedIn.value = true
}

function handleOnError(errorResponse: AuthCodeFlowErrorResponse) {
  toast.add({ title: 'Login failed', icon: 'i-lucide-x', color: 'red' })
  console.error('Error: ', errorResponse)
}

async function onSearchClick() {
  try {
    showResult.value = true
    searchLoading.value = true
    const messageResponse = await api.messages.list(searchQueryString.value)
    const labelResponse = await api.labels.get(categoryMapping[searchQuery.category])
    mails.value = messageResponse.messages || []
    count.value = mails.value.length
    nextPageToken.value = messageResponse.nextPageToken || ''
    total.value = searchQuery.isRead
      ? (labelResponse.messagesTotal || 0) - (labelResponse.messagesUnread || 0)
      : labelResponse.messagesUnread || 0
    totalUnread.value = labelResponse.messagesUnread || 0
    totalPages.value = Math.ceil(total.value / pageSize.value)
  }
  catch (error) {
    toast.add({ title: 'Login failed', icon: 'i-lucide-x', color: 'red' })
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
      await api.messages.batchModify(ids)
    else
      await api.messages.batchDelete(ids)

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

function flattenSearchQuery(): string {
  return `is:${searchQuery.isRead ? 'read' : 'unread'} \
  category:${searchQuery.category} \
  ${searchQuery.olderThan === 'none' ? '' : `older_than:${searchQuery.olderThan}`}`
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
      <MailFilter v-model="searchQuery" :loading="searchLoading" @search="onSearchClick" />
      <template v-if="showResult">
        <MailResult
          v-if="!searchLoading"
          :loading="executeLoading"
          :count="count"
          :total-count="total"
          :total-pages="totalPages"
          :query="searchQueryString"
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
