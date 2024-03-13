import { PRODUCT_PRICES } from './generate.js'

export const UPDATE_EVENT = 'update-table'
export const PRICES = PRODUCT_PRICES
export const PRODUCTS = Object.keys(PRICES)
export const TRANSLATIONS = {
  name: 'Компания',
  totalMoneySpent: 'Итого (руб.)',
  percentageOfTotalSales: 'Процент от всех продаж',
}
