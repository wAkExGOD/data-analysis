import { PRICES, PRODUCTS } from './constants.js'

export function validateRecords(records) {
  return records.filter(({ company, product, count }) =>
    Boolean(company && product && count > 0)
  )
}

export function formCompaniesArray(initialRows) {
  const filteredRows = validateRecords(initialRows)

  const companies = filteredRows.reduce((rows, r) => {
    const found = rows.find((c) => c.company === r.company)

    if (found) {
      const product = found.products.find((p) => p.name === r.product)
      product.amount += r.count
    } else {
      rows.push({
        company: r.company,
        products: PRODUCTS.map((productName) => ({
          name: productName,
          amount: productName === r.product ? r.count : 0,
          price: 0,
        })),
      })
    }

    return rows
  }, [])

  return fillCompaniesProductsWithMetrics(companies)
}

export function fillCompaniesProductsWithMetrics(companies) {
  const companiesWithTotalSpent = companies.map((company) => {
    PRODUCTS.forEach((productName) => {
      const product = company.products.find((p) => p.name === productName)
      product.price = convertNumber(product.amount * PRICES[productName])
    })

    company.revenue = convertNumber(
      company.products.reduce((sum, product) => (sum += product.price), 0)
    )
    return company
  })

  const sumOfTotalPurchases = convertNumber(
    companies.reduce((sum, c) => (sum += c.revenue), 0)
  )

  return companiesWithTotalSpent.map((company) => {
    company.percentageOfTotalPurchases = convertNumber(
      (company.revenue / sumOfTotalPurchases) * 100
    )

    return company
  })
}

export function convertNumber(number) {
  const convertedNumber = +number.toFixed(2)

  return isNaN(convertedNumber) ? null : convertedNumber
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

  return quantities.length > 0 ? convertNumber(Math.max(...quantities)) : 0
}

function calculateAverageSoldProductQuantity(tableEl, tdIndex) {
  const quantities = getNumbersFromElements(
    tableEl,
    `tbody > tr > td:nth-child(${tdIndex + 1})`
  )

  const filteredQuantities = quantities.filter((r) => r > 0)

  return filteredQuantities.length > 0
    ? convertNumber(
        filteredQuantities.reduce((sum, r) => (sum += r), 0) /
          filteredQuantities.length
      )
    : null
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

export function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall

    this.lastCall = Date.now()

    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer)
    }

    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs)
  }
}

export const metricsHelpers = {
  calculateMaxTotalProductAmount,
  calculateAverageSoldProductQuantity,
  calculateMedianOfAllProductSales,
  calculateSumOfTotalSales,
}
