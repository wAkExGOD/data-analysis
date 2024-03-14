import {
  TRANSLATIONS,
  PRODUCTS,
  ROWS_PER_PAGE_VARIANTS,
  TABLE_HEADERS,
} from './constants.js'
import { metricsHelpers } from './helpers.js'

export function render(state, eventHandlers) {
  const { onPageClick, onRowsPerPageClick } = eventHandlers

  const paginationWrapperEl = document.querySelector('.paginationWrapper')
  const tableWrapperEl = document.querySelector('.tableWrapper')
  const tableEl = document.createElement('table')

  tableWrapperEl.innerHTML = ''
  paginationWrapperEl.innerHTML = ''

  tableEl.appendChild(createTableHeaders(TABLE_HEADERS))
  tableEl.appendChild(createTableBody(state))
  tableEl.appendChild(createTableFooter(tableEl, TABLE_HEADERS))

  tableWrapperEl.appendChild(tableEl)
  paginationWrapperEl.appendChild(
    createPagination(state, onPageClick, onRowsPerPageClick)
  )
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
    .forEach((company) => {
      const rowEl = document.createElement('tr')

      const companyInfo = [
        company.company,
        ...getProductsAmountAndPrices(company),
        company.revenue,
        company.percentageOfTotalPurchases,
      ]
      companyInfo.forEach((value) => {
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

function getProductsAmountAndPrices(company) {
  return PRODUCTS.flatMap((productName) => {
    const product = company.products.find((p) => p.name === productName)

    if (!product) {
      return
    }

    return [product.amount, product.price]
  })
}

function createPagination(state, onPageClick, onRowsPerPageClick) {
  const { page, rowsPerPage } = state
  const paginationEl = document.createElement('div')
  paginationEl.classList.add('pagination')

  paginationEl.innerHTML = ''

  const prevButton = document.createElement('button')
  const nextButton = document.createElement('button')
  const selectWrapperEl = document.createElement('label')
  const rowsPerPageSelectEl = document.createElement('select')

  prevButton.classList.add('prev')
  nextButton.classList.add('next')
  nextButton.classList.add('next')
  selectWrapperEl.classList.add('select')
  prevButton.appendChild(document.createElement('i'))
  nextButton.appendChild(document.createElement('i'))
  ROWS_PER_PAGE_VARIANTS.map((v) => {
    const optionEl = document.createElement('option')
    optionEl.selected = v === rowsPerPage
    optionEl.textContent = v
    optionEl.value = v
    rowsPerPageSelectEl.appendChild(optionEl)
  })

  if (page - 1 === 0) {
    prevButton.classList.add('disabled')
  }
  if ((page + 1) * rowsPerPage > state.companies.length) {
    nextButton.classList.add('disabled')
  }

  prevButton.addEventListener('click', () => onPageClick(page - 1))
  rowsPerPageSelectEl.addEventListener('change', (e) =>
    onRowsPerPageClick(+e.target.value)
  )
  nextButton.addEventListener('click', () => onPageClick(page + 1))

  selectWrapperEl.appendChild(rowsPerPageSelectEl)
  paginationEl.appendChild(prevButton)
  paginationEl.appendChild(selectWrapperEl)
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
    columns: [TABLE_HEADERS.length - 2],
  },
]
