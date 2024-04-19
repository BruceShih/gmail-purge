import type { Age } from './age'
import type { Category } from './category'

export interface SearchQuery {
  isRead: boolean
  category: Category
  olderThan: Age
}
