import store from '@/store'
/**
 * 对象清空工具
 * @param {Object} obj
 * @returns
 */
export const clearObj = function (obj) {
  for (var key in obj) {
    delete obj[key]
  }
}

export const generateId = function () {
  return Math.floor(Math.random() * 100000 + Math.random() * 20000 + Math.random() * 5000)
}

/**
 * 深拷贝
 * @param {Object} origin
 * @returns {Object}
 */
export const deepClone = function (origin) {
  if (origin === undefined) {
    return undefined
  }

  return JSON.parse(JSON.stringify(origin))
}

/**
 * 浅拷贝
 * @param {Object} obj1
 * @param {Object} obj2
 * @returns {Object}
 */
export const overwriteObj = function (obj1, obj2) {
  /* 浅拷贝对象属性，obj2覆盖obj1 */
  Object.keys(obj2).forEach((prop) => {
    obj1[prop] = obj2[prop]
  })
}

export const addWindowResizeHandler = function (handler) {
  const oldHandler = window.onresize
  if (typeof window.onresize !== 'function') {
    window.onresize = handler
  } else {
    window.onresize = function () {
      oldHandler()
      handler()
    }
  }
}

/**
 * 安全获取对象深度层级数据
 * @param {Object} item
 * @param {string} keys
 * @returns {Object}
 */
export const getParameter = function (item, keys) {
  let result = null
  if (item && keys) {
    const keyList = keys.split('.')
    // 无可用键直接退出
    if (keyList.length > 0) {
      if (item.option) {
        result = item.option
      } else {
        result = item
      }
      // 可以换成递归
      keyList.forEach((key) => {
        if (result === null || result === undefined) {
          return
        }
        result = result[key]
      })
    }
  }
  return result
}

/**
 * 通过id获取vuex中的layout数据
 * @param {string} identify
 * @returns {Object}
 */
export const getLayoutById = function (identify) {
  const layout = store.state.app.layout
  const obj = layout.find((item) => {
    return item.i === identify
  })
  return obj
}

/**
 * 通过id获取vuex中的layout数据
 * @param {string} identify
 * @returns {Object}
 */
export const getLayoutOptionById = function (identify) {
  const layout = store.state.app.layout
  const obj = layout.find((item) => {
    return item.i === identify
  })
  if (obj && JSON.stringify(obj) !== '{}') {
    return obj.option
  }
  console.warn(`获取 ${identify} 组件配置信息为空`)
  return {}
}

/**
 * 通过id获取vuex中的dataValue数据
 * @param {string} identify
 * @returns {Object}
 */
export const getDataValueById = function (identify) {
  const dataOption = store.state.app.dataOption
  const obj = dataOption.find((item) => {
    return item.i === identify
  })
  if (obj && JSON.stringify(obj) !== '{}') {
    return obj.dataValue
  }
  console.warn(`获取 ${identify} 组件数据信息为空`)
  return {}
}

/**
 * 获取当前时间 格式为 yyyy - mm - dd hh : mm : ss
 */
export const getDateTime = () => {
  const getDate = new Date()
  const dateYear = getDate.getFullYear()
  let dateMonth = getDate.getMonth() + 1
  let dateDate = getDate.getDate()
  let dateHours = getDate.getHours()
  let dateMinutes = getDate.getMinutes()
  let dateSeconds = getDate.getSeconds()
  dateMonth = dateMonth < 10 ? '0' + dateMonth : dateMonth
  dateDate = dateDate < 10 ? '0' + dateDate : dateDate
  dateHours = dateHours < 10 ? '0' + dateHours : dateHours
  dateMinutes = dateMinutes < 10 ? '0' + dateMinutes : dateMinutes
  dateSeconds = dateSeconds < 10 ? '0' + dateSeconds : dateSeconds
  return dateYear + '-' + dateMonth + '-' + dateDate + ' ' + dateHours + ':' + dateMinutes + ':' + dateSeconds
}

/**
 * 将维度和度量的数据进行转换为图表需要的数据
 * @param {Array} data
 * @returns {Array}
 */
export const formatDataValue = function(data) {
  const dataValue = []
  data.forEach(item => {
    if (item.fields[0].type === 'Dimension') {
      const dataOption = []
      item.data.forEach(ele => {
        dataOption.push(ele[item.fields[0].displayColumn])
      })
      dataOption.unshift(item.fields[0].displayColumn)
      dataValue.unshift(dataOption)
    } else {
      const dataOption = []
      item.data.forEach(ele => {
        dataOption.push(ele[item.fields[0].displayColumn])
      })
      dataOption.unshift(item.fields[0].displayColumn)
      dataValue.push(dataOption)
    }
  })
  return dataValue
}
