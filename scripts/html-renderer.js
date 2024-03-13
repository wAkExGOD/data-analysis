import { TRANSLATIONS, PRODUCTS } from './constants.js'
import { metricsHelpers } from './helpers.js'

const headers = [
  'name',
  ...PRODUCTS.map((product) => [
    `${product} (шт.)`,
    `${product} (руб.)`,
  ]).flat(),
  'totalMoneySpent',
  'percentageOfTotalSales',
]

export function render(state, onPageClick) {
  const { companies } = state
  const containerEl = document.querySelector('.container')
  const tableEl = document.createElement('table')

  containerEl.innerHTML = ''

  tableEl.appendChild(createTableHeaders(headers))
  tableEl.appendChild(createTableBody(state))
  tableEl.appendChild(createTableFooter(tableEl, headers))

  containerEl.appendChild(tableEl)
  createPagination(state, onPageClick)
}

function createTableHeaders(headers) {
  const theadEl = document.createElement('thead')
  const rowEl = document.createElement('tr')
  headers.forEach((key) => {
    const tdEl = document.createElement('th')
    tdEl.innerText = TRANSLATIONS[key] || key
    rowEl.appendChild(tdEl)
  })
  theadEl.appendChild(rowEl)

  return theadEl
}

function createTableBody(state) {
  const { companies, page, rowsPerPage } = state
  const tbodyEl = document.createElement('tbody')

  companies
    .slice((page - 1) * rowsPerPage, page * rowsPerPage)
    .forEach((row) => {
      const rowEl = document.createElement('tr')

      const rowInfo = [
        row.name,
        ...getProductsInfo(row),
        row.totalMoneySpent,
        row.percentageOfTotalSales,
      ]
      rowInfo.forEach((value) => {
        const cellEl = document.createElement('td')
        cellEl.innerText = value
        rowEl.appendChild(cellEl)
      })

      tbodyEl.appendChild(rowEl)
    })

  return tbodyEl
}

function createTableFooter(tableEl, headers) {
  const tfootEl = document.createElement('tfoot')

  aggregations.forEach((aggregation, _) => {
    const rowEl = document.createElement('tr')

    Array.from({ length: headers.length }).forEach((_, j) => {
      const cellEl = document.createElement('td')
      rowEl.appendChild(cellEl)

      if (j === 0) {
        return (cellEl.innerText = aggregation.name)
      }

      cellEl.innerText = aggregation.columns.includes(j)
        ? aggregation.calculateValue(tableEl, j)
        : '-'
    })

    tfootEl.appendChild(rowEl)
  })

  return tfootEl
}

function getProductsInfo(row) {
  return PRODUCTS.map((product) => [
    row.productsQuantity[product],
    row.productsAmount[product],
  ]).flat()
}

function createPagination(state, onPageClick) {
  const { page, rowsPerPage } = state
  const paginationEl = document.querySelector('.pagination')

  paginationEl.innerHTML = ''

  const prevButton = document.createElement('button')
  const nextButton = document.createElement('button')

  prevButton.classList.add('prev')
  nextButton.classList.add('next')
  prevButton.appendChild(document.createElement('i'))
  nextButton.appendChild(document.createElement('i'))

  if (page - 1 === 0) {
    prevButton.classList.add('disabled')
  }
  if ((page + 1) * rowsPerPage > state.companies.length) {
    nextButton.classList.add('disabled')
  }

  prevButton.addEventListener('click', () => {
    onPageClick(page - 1)
  })
  // add select
  nextButton.addEventListener('click', () => {
    onPageClick(page + 1)
  })

  paginationEl.appendChild(prevButton)
  paginationEl.appendChild(nextButton)

  return paginationEl
}

const aggregations = [
  {
    calculateValue: metricsHelpers.calculateMaxTotalProductAmount,
    name: 'Максимум проданных единиц',
    columns: Array.from({ length: PRODUCTS.length }, (_, i) => 1 + 2 * i),
  },
  {
    calculateValue: metricsHelpers.calculateAverageSoldProductQuantity,
    name: 'Средне кол-во продаж',
    columns: Array.from({ length: PRODUCTS.length }, (_, i) => 1 + 2 * i),
  },
  {
    calculateValue: metricsHelpers.calculateMedianOfAllProductSales,
    name: 'Медианное кол-во продаж',
    columns: Array.from({ length: PRODUCTS.length }, (_, i) => 1 + 2 * i),
  },
  {
    calculateValue: metricsHelpers.calculateSumOfTotalSales,
    name: 'Сумма всех продаж',
    columns: [9],
  },
]
