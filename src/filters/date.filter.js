/**
 * 日期格式化过滤器
 *
 */

import moment from 'moment'

export const fullDateFilter = (date) => {
  return date ? moment.unix(date).format('YYYY-MM-DD HH:mm:ss') : ''
}

export const dateFilter = (timer) => {
  var jsonDate = new Date(timer).toJSON()
  return new Date(new Date(jsonDate) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, ' ')
    .replace(/\.[\d]{3}Z/, '')
}
