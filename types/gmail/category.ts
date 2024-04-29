export type Category = 'social' | 'promotions' | 'forums'
export type CategoryMapping = {
  [key in Category]: string
}
export const categoryMapping: CategoryMapping = {
  social: 'CATEGORY_SOCIAL',
  promotions: 'CATEGORY_PROMOTIONS',
  forums: 'CATEGORY_FORUMS'
}
