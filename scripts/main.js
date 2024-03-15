import { generateData } from './generate.js'
import { ROWS_PER_PAGE_VARIANTS, UPDATE_EVENT } from './constants.js'
import { formCompaniesArray } from './helpers.js'
import { render } from './html-renderer.js'

const RECORDS_N = 1000
const records = generateData(RECORDS_N)

const ALL_COMPANIES = formCompaniesArray(records)

const state = {
  page: 1,
  rowsPerPage: 10,
  filterText: '',
  companies: ALL_COMPANIES,
}

console.log(state)

const eventHandlers = {
  onPageClick: (page) => {
    if (page <= 0) {
      return
    }
    if (page * state.rowsPerPage > state.companies.length) {
      return
    }

    state.page = page
    window.dispatchEvent(new Event(UPDATE_EVENT))
  },
  onRowsPerPageClick: (rowsPerPage) => {
    if (!ROWS_PER_PAGE_VARIANTS.includes(rowsPerPage)) {
      return
    }

    if (state.page * rowsPerPage > state.companies.length) {
      state.page = 1
    }
    state.rowsPerPage = rowsPerPage
    window.dispatchEvent(new Event(UPDATE_EVENT))
  },
  onTextChange: (text) => {
    state.page = 1
    state.filterText = text
    state.companies = ALL_COMPANIES.filter(({ company }) =>
      text === '' ? true : company.toLowerCase().includes(text)
    )
    window.dispatchEvent(new Event(UPDATE_EVENT))
  },
}

window.addEventListener(UPDATE_EVENT, () => {
  render(state, eventHandlers)
})

window.dispatchEvent(new Event(UPDATE_EVENT))
