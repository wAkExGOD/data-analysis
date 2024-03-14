import { generateData } from './generate.js'
import { ROWS_PER_PAGE_VARIANTS, UPDATE_EVENT } from './constants.js'
import { formCompaniesArray } from './helpers.js'
import { render } from './html-renderer.js'

const RECORDS_N = 1000
const records = generateData(RECORDS_N)

const state = {
  page: 1,
  rowsPerPage: 10,
  companies: formCompaniesArray(records),
}

console.log(state)

const eventHandlers = {
  onPageClick: (page) => {
    if (page * state.rowsPerPage > state.companies.length || page <= 0) {
      return
    }

    state.page = page
    window.dispatchEvent(new Event(UPDATE_EVENT))
  },
  onRowsPerPageClick: (rowsPerPage) => {
    if (!ROWS_PER_PAGE_VARIANTS.includes(rowsPerPage)) {
      return
    }

    state.rowsPerPage = rowsPerPage
    window.dispatchEvent(new Event(UPDATE_EVENT))
  },
}

window.addEventListener(UPDATE_EVENT, () => {
  render(state, eventHandlers)
})

window.dispatchEvent(new Event(UPDATE_EVENT))
