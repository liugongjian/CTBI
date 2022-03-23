export default {
  install (Vue) {
    const filters = require.context('@/filters', true, /\.filter\.js/)
    filters.keys().forEach(key => {
      const f = filters(key)
      Object.keys(f).forEach(functionName => {
        Vue.filter(functionName, f[functionName])
      })
    })
  }
}
