import moment from 'moment'

export default {
  install (Vue) {
    const filters = require.context('@/filters', true, /\.filter\.js/)
    filters.keys().forEach(key => {
      const f = filters(key)
      Object.keys(f).forEach(functionName => {
        Vue.filter(functionName, f[functionName])
      })
    })
  },
  fullDateFilter (date) {
    return date ? moment.unix(date).format('YYYY-MM-DD HH:mm:ss') : ''
  },
  dateFilter (timer) {
    var jsonDate = new Date(timer).toJSON()
    return new Date(new Date(jsonDate) + 8 * 3600 * 1000)
      .toISOString()
      .replace(/T/g, ' ')
      .replace(/\.[\d]{3}Z/, '')
  }
}
