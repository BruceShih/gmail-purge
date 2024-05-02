<script setup lang="ts">
import type { AuthCodeFlowErrorResponse, AuthCodeFlowSuccessResponse } from 'vue3-google-signin'
import { useCustomToast } from '~/composables/useCustomToast'
import { useGmailApi } from '~/composables/api/useGmailApi'
import { useSearchQuery } from '~/composables/useSearchQuery'
import { notEmpty } from '~/helpers/filters'
import type { SearchQuery } from '~/types/gmail/searchQuery'

const { t } = useI18n()
const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
  scope: 'https://mail.google.com/'
})
const api = useGmailApi()
const toast = useCustomToast()
const searchQuery = useSearchQuery()

const labels = ref<gapi.client.gmail.Label[]>([])
const mails = ref<gapi.client.gmail.Message[]>([])
const count = ref(0)
const total = ref(0)
const totalUnread = ref(0)
const searchLoading = ref(false)
const executeLoading = ref(false)
const totalPages = ref(0)
const pageSize = ref(500)
const nextPageToken = ref('')
const query = reactive<SearchQuery>(searchQuery.defaultSearchQuery)
const searchQueryString = ref(searchQuery.toString(query))
const showResult = ref(false)
const isLoggedIn = ref(false)

watch(query, () => {
  showResult.value = false
  searchQueryString.value = searchQuery.toString(query)
})

async function handleOnSuccess(response: AuthCodeFlowSuccessResponse) {
  api.setToken(response.access_token)
  api.setPageSize(pageSize.value)
  isLoggedIn.value = true

  try {
    const response = await api.labels.list()
    const filteredLabels = response.labels?.filter(label => label.type !== 'user')
    if (filteredLabels)
      labels.value = filteredLabels
  }
  catch (error) {
    toast.show(t('errorOperation'), 'error')
    console.error(error)
  }
}
function handleOnError(errorResponse: AuthCodeFlowErrorResponse) {
  toast.show(t('errorLogin'), 'error')
  console.error('Error: ', errorResponse)
}
async function onSearchClick() {
  try {
    showResult.value = true
    searchLoading.value = true
    const messageResponse = await api.messages.list(searchQueryString.value)
    const labelResponse = await api.labels.get(query.category.id || '')
    mails.value = messageResponse.messages || []
    count.value = mails.value.length
    nextPageToken.value = messageResponse.nextPageToken || ''
    total.value = query.isRead
      ? (labelResponse.messagesTotal || 0) - (labelResponse.messagesUnread || 0)
      : labelResponse.messagesUnread || 0
    totalUnread.value = labelResponse.messagesUnread || 0
    totalPages.value = Math.ceil(total.value / pageSize.value)
  }
  catch (error) {
    toast.show(t('errorOperation'), 'error')
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

    toast.show(t('successOperation'), 'success')
  }
  catch (error) {
    console.error(error)
    toast.show(t('errorOperation'), 'error')
  }
  finally {
    executeLoading.value = false
    showResult.value = false
  }
}
</script>

<template>
  <h1 class="text-center mb-3 text-4xl">
    {{ t('brand') }}
  </h1>
  <p class="text-center mb-8">
    {{ t('brandDescription') }}
  </p>
  <UButton
    v-if="!isLoggedIn"
    class="flex gap-0 mx-auto px-3 py-[10px]  bg-white dark:bg-[#131314] dark:text-[#e3e3e3] ring-[#747775]
      ring-inset text-[#1f1f1f]"
    color="white"
    :disabled="!isReady"
    @click="() => login()"
  >
    <UIcon class="w-5 h-5 mr-[10px]" name="i-logos-google-icon" />
    <label class="text-sm text-left">{{ t('signIn') }}</label>
  </UButton>
  <template v-if="isLoggedIn">
    <MailFilter v-model="query" :labels="labels" :loading="searchLoading" @search="onSearchClick" />
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
</template>
