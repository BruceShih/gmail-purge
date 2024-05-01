import type { Age } from './age'

export interface SearchQuery {
  isRead: boolean
  category: gapi.client.gmail.Label
  olderThan: Age
}
