import type { SearchQuery } from '~/types/gmail/searchQuery'

export function useSearchQuery() {
  const defaultSearchQuery = {
    isRead: false,
    category: {
      id: 'CATEGORY_PROMOTIONS'
    },
    olderThan: 'all'
  } satisfies SearchQuery

  const toString = (query: SearchQuery) => {
    const category = (query.category.id || '').toLowerCase().replace('category_', '')
    return `is:${query.isRead ? 'read' : 'unread'} category:${category} `
      + `${query.olderThan === 'all' ? '' : `older_than:${query.olderThan}`}`
  }

  return { defaultSearchQuery, toString }
}
