import { PRICES, PRODUCTS } from './constants.js'

export function validateRecords(records) {
  return records.filter(({ company, product, count }) =>
    Boolean(company && product && count > 0)
  )
}

export function formCompaniesArray(initialRows) {
  const filteredRows = validateRecords(initialRows)

  const completedRows = filteredRows.reduce((rows, r) => {
    const found = rows.find((c) => c.name === r.company)

    if (found) {
      found.productsQuantity[r.product] =
        found.productsQuantity[r.product] + r.count
    } else {
      const company = {
        name: r.company,
        productsQuantity: {
          [r.product]: r.count,
        },
        productsAmount: {},
      }
      PRODUCTS.forEach((product) => {
        company.productsQuantity[product] =
          company.productsQuantity[product] ?? 0
        company.productsAmount[product] = company.productsAmount[product] ?? 0
      })
      rows.push(company)
    }

    return rows
  }, [])

  return fillCompaniesProductsWithMetrics(completedRows)
}

export function fillCompaniesProductsWithMetrics(rows) {
  const rowsWithTotalSpent = rows.map((company) => {
    PRODUCTS.forEach((product) => {
      company.productsAmount[product] = convertNumber(
        company.productsQuantity[product] * PRICES[product]
      )
    })
    company.totalMoneySpent = convertNumber(
      PRODUCTS.reduce(
        (sum, product) => sum + company.productsAmount[product],
        0
      )
    )
    return company
  })
  const sumOfTotalSales = convertNumber(
    rows.reduce((sumOfAllSales, r) => (sumOfAllSales += r.totalMoneySpent), 0)
  )

  return rowsWithTotalSpent.map((company) => {
    company.percentageOfTotalSales = convertNumber(
      (company.totalMoneySpent / sumOfTotalSales) * 100
    )

    return company
  })
}

export function convertNumber(number) {
  const convertedNumber = +number.toFixed(2)

  return typeof convertedNumber === 'number' ? convertedNumber : null
}

export function getNumbersFromElements(tableEl, elementsSelector) {
  return [...tableEl.querySelectorAll(elementsSelector)].map(
    (el) => +el.innerText
  )
}

function calculateMaxTotalProductAmount(tableEl, tdIndex) {
  const quantities = getNumbersFromElements(
    tableEl,
    `tbody > tr > td:nth-child(${tdIndex + 1})`
  )

  return convertNumber(Math.max(...quantities))
}

function calculateAverageSoldProductQuantity(tableEl, tdIndex) {
  const quantities = getNumbersFromElements(
    tableEl,
    `tbody > tr > td:nth-child(${tdIndex + 1})`
  )

  const filteredQuantities = quantities.filter((r) => r > 0)

  return convertNumber(
    filteredQuantities.reduce((sum, r) => (sum += r), 0) /
      filteredQuantities.length
  )
}

function calculateMedianOfAllProductSales(tableEl, tdIndex) {
  const quantities = getNumbersFromElements(
    tableEl,
    `tbody > tr > td:nth-child(${tdIndex + 1})`
  )

  const descendingSortedQuantities = quantities
    .filter((r) => r > 0)
    .toSorted((a, b) => a - b)

  const halfIndex = Math.floor(descendingSortedQuantities.length / 2)
  if (descendingSortedQuantities.length % 2 === 0) {
    return convertNumber(
      (descendingSortedQuantities[halfIndex] +
        descendingSortedQuantities[halfIndex - 1]) /
        2
    )
  } else {
    return convertNumber(descendingSortedQuantities[halfIndex])
  }
}

function calculateSumOfTotalSales(tableEl, tdIndex) {
  const amounts = getNumbersFromElements(
    tableEl,
    `tbody > tr > td:nth-child(${tdIndex + 1})`
  )

  return convertNumber(
    amounts.reduce((sumOfAllSales, amount) => (sumOfAllSales += amount), 0)
  )
}

export const metricsHelpers = {
  calculateMaxTotalProductAmount,
  calculateAverageSoldProductQuantity,
  calculateMedianOfAllProductSales,
  calculateSumOfTotalSales,
}
