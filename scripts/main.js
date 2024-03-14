import { generateData } from './generate.js'
import { UPDATE_EVENT } from './constants.js'
import { formCompaniesArray } from './helpers.js'
import { render } from './html-renderer.js'

const RECORDS_N = 1000
const records = generateData(RECORDS_N)

console.log(records)

const state = {
  page: 1,
  rowsPerPage: 16,
  companies: formCompaniesArray(records),
}

console.log(state)

window.addEventListener(UPDATE_EVENT, () => {
  const handleSetPage = (page) => {
    if (page * state.rowsPerPage > state.companies.length || page <= 0) {
      return
    }

    state.page = page
    window.dispatchEvent(new Event(UPDATE_EVENT))
  }

  render(state, handleSetPage)
})

window.dispatchEvent(new Event(UPDATE_EVENT))
