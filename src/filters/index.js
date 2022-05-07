const filters = require.context('@/filters', true, /\.filter\.js/)
export const initFilters = (Vue) => {
  filters.keys().forEach(key => {
    const f = filters(key)
    Object.keys(f).forEach(functionName => {
      Vue.filter(functionName, f[functionName])
    })
  })
}

export default (Vue) => {
  initFilters(Vue)
}

