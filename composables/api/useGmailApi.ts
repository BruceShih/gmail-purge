export function useGmailApi() {
  const token = useState<string>('t')

  const setToken = (value: string) => {
    token.value = value
  }

  const get = async (id: string) => {
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
  }

  const list = async (searchQuery: string) => {
    if (!token.value)
      throw new Error('Login to google first.')

    try {
      return await $fetch<gapi.client.gmail.ListMessagesResponse>(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages',
        {
          headers: {
            Authorization: `Bearer ${token.value}`
          },
          query: {
            q: searchQuery
          }
        }
      )
    }
    catch (error) {
      throw new Error(JSON.stringify(error))
    }
  }

  const batchDelete = async (ids: string[]) => {
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

  return { setToken, get, list, batchDelete }
}
