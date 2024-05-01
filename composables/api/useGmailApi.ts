export function useGmailApi() {
  const token = useState<string>('t')
  const pageSize = useState<number>('ps')

  const setToken = (value: string) => {
    token.value = value
  }

  const setPageSize = (value: number) => {
    pageSize.value = value
  }

  const labels = {
    get: async (id: string) => {
      if (!token.value)
        throw new Error('Login to google first.')

      try {
        return await $fetch<gapi.client.gmail.Label>(
          `https://gmail.googleapis.com/gmail/v1/users/me/labels/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token.value}`
            }
          }
        )
      }
      catch (error) {
        throw new Error(JSON.stringify(error))
      }
    },
    list: async () => {
      if (!token.value)
        throw new Error('Login to google first.')

      try {
        return await $fetch<gapi.client.gmail.ListLabelsResponse>(
          'https://gmail.googleapis.com/gmail/v1/users/me/labels',
          {
            headers: {
              Authorization: `Bearer ${token.value}`
            }
          }
        )
      }
      catch (error) {
        throw new Error(JSON.stringify(error))
      }
    }
  }

  const messages = {
    get: async (id: string) => {
      if (!token.value)
        throw new Error('Login to google first.')

      try {
        return await $fetch<gapi.client.gmail.Message>(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token.value}`
            }
          }
        )
      }
      catch (error) {
        throw new Error(JSON.stringify(error))
      }
    },
    list: async (searchQuery: string, nextPageToken?: string) => {
      if (!token.value)
        throw new Error('Login to google first.')

      try {
        const query = {
          q: searchQuery,
          maxResults: pageSize.value
        }

        return await $fetch<gapi.client.gmail.ListMessagesResponse>(
          'https://gmail.googleapis.com/gmail/v1/users/me/messages',
          {
            headers: {
              Authorization: `Bearer ${token.value}`
            },
            query: {
              ...query,
              ...(nextPageToken ? { pageToken: nextPageToken } : {})
            }
          }
        )
      }
      catch (error) {
        throw new Error(JSON.stringify(error))
      }
    },
    batchModify: async (ids: string[]) => {
      if (!token.value)
        throw new Error('Login to google first.')

      try {
        const response = await useFetch<null>(
          'https://gmail.googleapis.com/gmail/v1/users/me/messages/batchModify',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token.value}`
            },
            body: {
              ids,
              addLabelIds: ['TRASH'],
              removeLabelIds: ['UNREAD']
            }
          }
        )

        if (response.error.value)
          throw new Error(response.error.value?.message)
      }
      catch (error) {
        throw new Error(JSON.stringify(error))
      }
    },
    batchDelete: async (ids: string[]) => {
      if (!token.value)
        throw new Error('Login to google first.')

      try {
        const response = await useFetch<null>(
          'https://gmail.googleapis.com/gmail/v1/users/me/messages/batchDelete',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token.value}`
            },
            body: {
              ids
            }
          }
        )

        if (response.error.value)
          throw new Error(response.error.value?.message)
      }
      catch (error) {
        throw new Error(JSON.stringify(error))
      }
    }
  }

  return { setToken, setPageSize, labels, messages }
}
