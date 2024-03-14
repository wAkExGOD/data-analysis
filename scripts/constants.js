import { PRODUCT_PRICES } from './generate.js'

export const PRICES = PRODUCT_PRICES
export const PRODUCTS = Object.keys(PRICES)
export const UPDATE_EVENT = 'update-table'
export const ROWS_PER_PAGE_VARIANTS = [10, 50, 100]
export const TABLE_HEADERS = [
  'name',
  ...PRODUCTS.map((product) => [
    `${product} (шт.)`,
    `${product} (руб.)`,
  ]).flat(),
  'revenue',
  'percentageOfTotalPurchases',
]
export const TRANSLATIONS = {
  name: 'Компания',
  revenue: 'Итого (руб.)',
  percentageOfTotalPurchases: 'Процент от всех продаж',
}
